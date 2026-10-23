"use client";

import { useState } from "react";

export default function CopyMediaUrl({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      const url = `${window.location.origin}/cms-media/${path}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      className={`admin-copy-url-btn ${copied ? "is-copied" : ""}`}
      onClick={handleCopy}
      title="Copy public URL"
    >
      {copied ? "✓ Copied" : "Copy URL"}
    </button>
  );
}
