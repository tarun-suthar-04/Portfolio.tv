/* eslint-disable @next/next/no-img-element -- local client blob previews do not pass through next/image optimizer */
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { attachMedia } from "@/app/admin/actions";

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
]);

const MAX_BYTES = Math.min(
  Number(process.env.NEXT_PUBLIC_CMS_MAX_UPLOAD_BYTES ?? 524288000),
  524288000
);

interface QueuedFile {
  id: string;
  file: File;
  previewUrl: string;
  isVideo: boolean;
  posterFile: File | null;
  posterPreviewUrl: string | null;
  width?: number;
  height?: number;
  status: "idle" | "uploading" | "attaching" | "success" | "error";
  progress: number;
  errorMessage?: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

async function uploadToStorage(
  token: string,
  path: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<void> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!base || !key) throw new Error("Supabase is not configured.");

  const encoded = path.split("/").map(encodeURIComponent).join("/");
  const url = `${base}/storage/v1/object/portfolio-media/${encoded}`;

  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("apikey", key);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.setRequestHeader("cache-control", "max-age=3600");
    xhr.setRequestHeader("x-upsert", "false");

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
    }

    xhr.onerror = () => reject(new Error("Network error during file upload. Check your connection."));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        try {
          const res = JSON.parse(xhr.responseText);
          reject(new Error(res.message || res.error || `Storage error (${xhr.status})`));
        } catch {
          reject(new Error(`Storage error (${xhr.status}): ${xhr.responseText.slice(0, 150)}`));
        }
      }
    };

    xhr.send(file);
  });
}

function extractVideoDetails(file: File): Promise<{ width: number; height: number; poster: File | null }> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    const url = URL.createObjectURL(file);
    video.src = url;

    const timeout = setTimeout(() => {
      URL.revokeObjectURL(url);
      resolve({ width: 1920, height: 1080, poster: null });
    }, 4000);

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(0.5, video.duration > 1 ? 1 : video.duration / 2);
    };

    video.onseeked = () => {
      clearTimeout(timeout);
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 1920;
        canvas.height = video.videoHeight || 1080;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(url);
              if (blob) {
                const posterName = `${file.name.replace(/\.[^/.]+$/, "")}-poster.jpg`;
                const poster = new File([blob], posterName, { type: "image/jpeg" });
                resolve({ width: canvas.width, height: canvas.height, poster });
              } else {
                resolve({ width: canvas.width, height: canvas.height, poster: null });
              }
            },
            "image/jpeg",
            0.85
          );
        } else {
          URL.revokeObjectURL(url);
          resolve({ width: video.videoWidth || 1920, height: video.videoHeight || 1080, poster: null });
        }
      } catch {
        URL.revokeObjectURL(url);
        resolve({ width: video.videoWidth || 1920, height: video.videoHeight || 1080, poster: null });
      }
    };

    video.onerror = () => {
      clearTimeout(timeout);
      URL.revokeObjectURL(url);
      resolve({ width: 1920, height: 1080, poster: null });
    };
  });
}

export default function UploadMedia({ projectId }: { projectId: string }) {
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const [activeVideoIdForPoster, setActiveVideoIdForPoster] = useState<string | null>(null);
  const router = useRouter();

  // Clean up object URLs when component unmounts or queue items are removed
  useEffect(() => {
    return () => {
      queue.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        if (item.posterPreviewUrl) URL.revokeObjectURL(item.posterPreviewUrl);
      });
    };
  }, [queue]);

  const addFilesToQueue = async (files: File[]) => {
    setGlobalError(null);
    setGlobalSuccess(null);

    const newItems: QueuedFile[] = [];

    for (const file of files) {
      if (!ALLOWED_MIME.has(file.type)) {
        setGlobalError(`"${file.name}" is not a supported file type. Use JPG, PNG, WebP, AVIF, MP4, or WebM.`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        setGlobalError(`"${file.name}" exceeds the maximum upload limit of ${formatBytes(MAX_BYTES)}.`);
        continue;
      }

      const isVideo = file.type.startsWith("video/");
      const previewUrl = URL.createObjectURL(file);
      const id = crypto.randomUUID();

      let width = 0;
      let height = 0;
      let posterFile: File | null = null;
      let posterPreviewUrl: string | null = null;

      if (!isVideo) {
        try {
          const img = await createImageBitmap(file);
          width = img.width;
          height = img.height;
          img.close();
        } catch {
          width = 1920;
          height = 1080;
        }
      } else {
        const details = await extractVideoDetails(file);
        width = details.width;
        height = details.height;
        if (details.poster) {
          posterFile = details.poster;
          posterPreviewUrl = URL.createObjectURL(details.poster);
        }
      }

      newItems.push({
        id,
        file,
        previewUrl,
        isVideo,
        posterFile,
        posterPreviewUrl,
        width,
        height,
        status: "idle",
        progress: 0,
      });
    }

    if (newItems.length > 0) {
      setQueue((prev) => [...prev, ...newItems]);
    }
  };

  const handleCustomPosterSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const poster = e.target.files?.[0];
    if (!poster || !activeVideoIdForPoster) return;

    if (!poster.type.startsWith("image/") || !ALLOWED_MIME.has(poster.type)) {
      setGlobalError("Poster must be a valid image file (JPG, PNG, WebP, or AVIF).");
      return;
    }

    const previewUrl = URL.createObjectURL(poster);

    setQueue((prev) =>
      prev.map((item) => {
        if (item.id === activeVideoIdForPoster) {
          if (item.posterPreviewUrl) URL.revokeObjectURL(item.posterPreviewUrl);
          return {
            ...item,
            posterFile: poster,
            posterPreviewUrl: previewUrl,
          };
        }
        return item;
      })
    );

    setActiveVideoIdForPoster(null);
    if (posterInputRef.current) posterInputRef.current.value = "";
  };

  const removeItem = (id: string) => {
    if (busy) return;
    setQueue((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        if (item.posterPreviewUrl) URL.revokeObjectURL(item.posterPreviewUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const clearQueue = () => {
    if (busy) return;
    queue.forEach((item) => {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      if (item.posterPreviewUrl) URL.revokeObjectURL(item.posterPreviewUrl);
    });
    setQueue([]);
    setGlobalError(null);
  };

  const uploadAll = async () => {
    if (queue.length === 0 || busy) return;
    setBusy(true);
    setGlobalError(null);
    setGlobalSuccess(null);

    const db = createClient();
    const { data: { session } } = await db.auth.getSession();

    if (!session) {
      setBusy(false);
      setGlobalError("Your session has expired. Please sign in again.");
      return;
    }

    let successCount = 0;
    const remainingQueue: QueuedFile[] = [];

    for (const item of queue) {
      if (item.status === "success") {
        continue;
      }

      setQueue((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, status: "uploading", progress: 0 } : q))
      );

      let storagePath = "";
      let posterPath = "";

      try {
        const extension = item.file.name.split(".").pop()?.toLowerCase() || (item.isVideo ? "mp4" : "jpg");
        const fileUid = crypto.randomUUID();
        storagePath = `${projectId}/${fileUid}.${extension}`;

        // 1. Upload main media file with progress
        await uploadToStorage(session.access_token, storagePath, item.file, (percent) => {
          setQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, progress: percent } : q))
          );
        });

        // 2. Upload video poster if applicable (MUST be in projectId/posters/ folder)
        if (item.isVideo && item.posterFile) {
          const posterExt = item.posterFile.name.split(".").pop()?.toLowerCase() || "jpg";
          posterPath = `${projectId}/posters/${crypto.randomUUID()}.${posterExt}`;
          await uploadToStorage(session.access_token, posterPath, item.posterFile);
        }

        // 3. Attach media record to project in database
        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: "attaching" } : q))
        );

        const attachRes = await attachMedia({
          projectId,
          media_type: item.isVideo ? "video" : "image",
          storage_path: storagePath,
          thumbnail_path: posterPath || undefined,
          alt_text: item.file.name.replace(/\.[^/.]+$/, ""),
          width: item.width || 1920,
          height: item.height || 1080,
          mime_type: item.file.type,
          file_size: item.file.size,
        });

        if (!attachRes.success) {
          throw new Error(attachRes.error || "Failed to attach media to project");
        }

        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: "success", progress: 100 } : q))
        );
        successCount++;
      } catch (err) {
        // Rollback uploaded storage files if database attachment fails
        const toClean = [storagePath, posterPath].filter(Boolean);
        if (toClean.length > 0) {
          await db.storage.from("portfolio-media").remove(toClean);
        }

        const msg = err instanceof Error ? err.message : "Upload failed";
        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: "error", errorMessage: msg } : q))
        );
        remainingQueue.push(item);
      }
    }

    setBusy(false);

    if (successCount > 0) {
      setGlobalSuccess(`Successfully uploaded and attached ${successCount} media asset${successCount > 1 ? "s" : ""}.`);
      router.refresh();
      // Keep only failed items in queue
      setQueue((prev) => prev.filter((i) => i.status !== "success"));
    }
  };

  return (
    <div className="upload-manager">
      {/* Hidden file pickers */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
        multiple
        className="sr-only"
        onChange={(e) => {
          if (e.target.files) addFilesToQueue(Array.from(e.target.files));
          e.target.value = "";
        }}
      />
      <input
        ref={posterInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="sr-only"
        onChange={handleCustomPosterSelect}
      />

      {/* Modern Drag-and-Drop Dropzone */}
      <div
        className={`upload-dropzone ${isDragging ? "is-dragover" : ""} ${busy ? "is-disabled" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!busy) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (!busy && e.dataTransfer.files) {
            addFilesToQueue(Array.from(e.dataTransfer.files));
          }
        }}
        onClick={() => {
          if (!busy) fileInputRef.current?.click();
        }}
      >
        <div className="upload-dropzone-content">
          <div className="upload-icon-wrap" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div className="upload-prompt">
            <p className="upload-title">
              <strong>Drag &amp; drop media files here</strong> or <span className="upload-browse-link">browse</span>
            </p>
            <p className="upload-subtitle">
              JPG, PNG, WebP, AVIF, MP4, WebM • Up to {formatBytes(MAX_BYTES)} per file
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {globalError && (
        <div className="upload-alert upload-alert-error" role="alert">
          <span>{globalError}</span>
          <button type="button" onClick={() => setGlobalError(null)} aria-label="Dismiss error">✕</button>
        </div>
      )}
      {globalSuccess && (
        <div className="upload-alert upload-alert-success" role="status">
          <span>{globalSuccess}</span>
          <button type="button" onClick={() => setGlobalSuccess(null)} aria-label="Dismiss success">✕</button>
        </div>
      )}

      {/* Selected Files Queue Preview */}
      {queue.length > 0 && (
        <div className="upload-queue">
          <div className="upload-queue-header">
            <h3>Selected Files ({queue.length})</h3>
            <div className="upload-queue-actions">
              <button
                type="button"
                className="upload-btn-secondary"
                disabled={busy}
                onClick={clearQueue}
              >
                Clear all
              </button>
              <button
                type="button"
                className="upload-btn-primary"
                disabled={busy}
                onClick={uploadAll}
              >
                {busy ? "Uploading..." : `Upload ${queue.length} file${queue.length > 1 ? "s" : ""}`}
              </button>
            </div>
          </div>

          <div className="upload-items-grid">
            {queue.map((item) => (
              <div key={item.id} className={`upload-card ${item.status === "error" ? "has-error" : ""}`}>
                <div className="upload-card-media">
                  {item.isVideo ? (
                    item.posterPreviewUrl ? (
                      <img src={item.posterPreviewUrl} alt="" className="upload-card-thumb" />
                    ) : (
                      <div className="upload-video-placeholder">
                        <span>VIDEO</span>
                      </div>
                    )
                  ) : (
                    <img src={item.previewUrl} alt="" className="upload-card-thumb" />
                  )}
                  <span className="upload-badge">{item.isVideo ? "VIDEO" : "STILL"}</span>
                </div>

                <div className="upload-card-info">
                  <div className="upload-card-meta">
                    <span className="upload-card-name" title={item.file.name}>{item.file.name}</span>
                    <span className="upload-card-size">{formatBytes(item.file.size)}</span>
                  </div>

                  {item.isVideo && (
                    <div className="upload-poster-meta">
                      <span className="upload-poster-label">
                        {item.posterFile ? "Poster attached" : "Auto-poster"}
                      </span>
                      <button
                        type="button"
                        className="upload-poster-btn"
                        disabled={busy}
                        onClick={() => {
                          setActiveVideoIdForPoster(item.id);
                          posterInputRef.current?.click();
                        }}
                      >
                        Change poster
                      </button>
                    </div>
                  )}

                  {/* Progress bar */}
                  {item.status === "uploading" && (
                    <div className="upload-progress-wrap">
                      <div className="upload-progress-track">
                        <div className="upload-progress-fill" style={{ width: `${item.progress}%` }} />
                      </div>
                      <span className="upload-progress-text">{item.progress}%</span>
                    </div>
                  )}

                  {item.status === "attaching" && (
                    <span className="upload-status-attaching">Linking asset...</span>
                  )}

                  {item.status === "error" && (
                    <p className="upload-card-error">{item.errorMessage || "Upload failed"}</p>
                  )}
                </div>

                <button
                  type="button"
                  className="upload-card-remove"
                  disabled={busy}
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.file.name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
