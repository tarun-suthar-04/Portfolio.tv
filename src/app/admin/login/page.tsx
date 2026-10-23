"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      window.location.assign("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-login-wrapper">
      <div className="admin-login-box">
        <header className="admin-login-header">
          <p className="eyebrow">RESTRICTED ACCESS • CMS</p>
          <h1>Tarun Suthar</h1>
          <p className="admin-login-desc">Sign in to manage portfolio projects, media, and archive structure.</p>
        </header>

        <form onSubmit={submit} className="admin-login-form">
          <label>
            <span>Email Address</span>
            <input
              name="email"
              type="email"
              autoComplete="username"
              placeholder="admin@example.com"
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••••••"
              required
            />
          </label>

          {error && (
            <div className="admin-login-error" role="alert">
              <span>✕ {error}</span>
            </div>
          )}

          <button type="submit" className="admin-cta admin-login-btn" disabled={busy}>
            {busy ? "Authenticating..." : "Sign in to Dashboard →"}
          </button>
        </form>

        <footer className="admin-login-footer">
          <Link href="/" className="admin-back-link">
            ← Return to public portfolio
          </Link>
        </footer>
      </div>
    </main>
  );
}
