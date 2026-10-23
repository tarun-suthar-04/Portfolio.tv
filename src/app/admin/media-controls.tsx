"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { removeMedia, reorderProjectMedia } from "@/app/admin/actions";

interface MediaControlsProps {
  projectId: string;
  ids: string[];
  index: number;
  id: string;
}

export default function MediaControls({
  projectId,
  ids,
  index,
  id,
}: MediaControlsProps) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function move(direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= ids.length) return;
    const next = [...ids];
    [next[index], next[target]] = [next[target], next[index]];
    setBusy(true);
    try {
      await reorderProjectMedia({ projectId, ids: next });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm("Remove this media from the project and permanently delete its file?")) {
      return;
    }
    setBusy(true);
    try {
      await removeMedia({ projectId, id });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-card-controls">
      <div className="admin-reorder-group">
        <button
          type="button"
          className="admin-btn-icon"
          title="Move Earlier"
          aria-label="Move Earlier"
          disabled={busy || index === 0}
          onClick={() => move(-1)}
        >
          ↑
        </button>
        <button
          type="button"
          className="admin-btn-icon"
          title="Move Later"
          aria-label="Move Later"
          disabled={busy || index === ids.length - 1}
          onClick={() => move(1)}
        >
          ↓
        </button>
      </div>

      <button
        type="button"
        className="admin-btn-danger-sm"
        disabled={busy}
        onClick={remove}
      >
        {busy ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
