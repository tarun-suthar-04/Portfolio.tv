import Link from "next/link";
import { saveProject } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/server";
import ProjectIdentity from "@/app/admin/project-identity";

export const dynamic = "force-dynamic";

export default async function NewProject() {
  const db = await createClient();
  const { data: categories } = await db!
    .from("categories")
    .select("id, name")
    .order("display_order");

  return (
    <div className="admin-new-project-page">
      <header className="admin-heading">
        <div className="admin-heading-breadcrumbs">
          <Link href="/admin/projects" className="admin-back-link">
            ← Projects
          </Link>
          <span className="admin-heading-sep">/</span>
          <span className="admin-heading-meta">New</span>
        </div>

        <div className="admin-heading-title-row">
          <div>
            <h1>Add New Project</h1>
            <p className="admin-subtitle">
              Create a new portfolio entry. You will be able to upload media assets right after saving.
            </p>
          </div>
        </div>
      </header>

      <form action={saveProject} className="admin-form">
        <div className="admin-form-section">
          <h2 className="admin-section-title">Identity &amp; Details</h2>

          <ProjectIdentity />

          <div className="admin-form-grid">
            <label>
              <span>Category</span>
              <select name="category_id" required>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Year / Date</span>
              <input name="year" maxLength={20} placeholder="e.g. 2025" />
            </label>
          </div>

          <label>
            <span>Description</span>
            <textarea
              name="description"
              rows={4}
              placeholder="Editorial narrative or project context..."
            />
          </label>

          <label>
            <span>Credits &amp; Roles</span>
            <textarea
              name="credits"
              rows={3}
              placeholder="Creative Direction — Tarun Suthar&#10;Motion Design — John Doe"
            />
            <small className="admin-field-hint">One per line: Role — Name</small>
          </label>

          <div className="admin-form-grid">
            <label>
              <span>Display Order</span>
              <input name="display_order" type="number" defaultValue="0" />
              <small className="admin-field-hint">Lower numbers appear first</small>
            </label>

            <label>
              <span>Publishing Status</span>
              <select name="status" defaultValue="draft">
                <option value="draft">Draft (Private, not visible)</option>
                <option value="published">Published (Live in archive)</option>
              </select>
            </label>
          </div>

          <label className="admin-checkbox-label">
            <input name="is_featured" type="checkbox" />
            <span>Feature on homepage media wall</span>
          </label>

          <div className="admin-form-actions">
            <button type="submit" className="admin-cta">
              Create Project &amp; Continue to Media →
            </button>
            <Link href="/admin/projects" className="admin-btn-secondary">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
