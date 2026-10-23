import { createClient } from "@/lib/supabase/server";
import { saveCategory, deleteCategory } from "@/app/admin/actions";
import ConfirmForm from "@/app/admin/confirm-form";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Categories() {
  const db = await createClient();
  if (!db) return null;

  const { data } = await db
    .from("categories")
    .select("id, name, slug, description, display_order, projects(id, title, slug)")
    .order("display_order");

  return (
    <div className="admin-categories-page">
      <header className="admin-heading">
        <p className="eyebrow">ARCHIVE STRUCTURE</p>
        <div className="admin-heading-title-row">
          <div>
            <h1>Categories</h1>
            <p className="admin-subtitle">
              Manage portfolio navigation sections and archive categorization.
            </p>
          </div>
        </div>
      </header>

      {/* Add New Category */}
      <section className="admin-section">
        <h2>Create New Category</h2>
        <form action={saveCategory} className="admin-form">
          <div className="admin-form-grid">
            <label>
              <span>Category Name</span>
              <input name="name" required placeholder="e.g. Experiments" />
            </label>
            <label>
              <span>Slug (URL Path)</span>
              <input
                name="slug"
                required
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                placeholder="e.g. experiments"
              />
            </label>
          </div>

          <div className="admin-form-grid">
            <label>
              <span>Description</span>
              <input name="description" placeholder="Brief editorial note..." />
            </label>
            <label>
              <span>Display Order</span>
              <input name="display_order" type="number" defaultValue="0" />
            </label>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="admin-cta">
              Create Category
            </button>
          </div>
        </form>
      </section>

      {/* Existing Categories */}
      <section className="admin-section">
        <h2>Existing Categories ({data?.length ?? 0})</h2>

        <div className="admin-category-list">
          {data?.map((cat) => {
            const projectCount = cat.projects?.length ?? 0;
            const archivePath = ["stories", "commercials", "personal"].includes(cat.slug)
              ? `/${cat.slug}`
              : `/category/${cat.slug}`;

            return (
              <article className="admin-category-card" key={cat.id}>
                <form action={saveCategory} className="admin-category-form">
                  <input type="hidden" name="id" value={cat.id} />

                  <div className="admin-category-fields">
                    <label>
                      <span>Name</span>
                      <input name="name" defaultValue={cat.name} required />
                    </label>
                    <label>
                      <span>Slug</span>
                      <input
                        name="slug"
                        defaultValue={cat.slug}
                        required
                        pattern="[a-z0-9]+(-[a-z0-9]+)*"
                      />
                    </label>
                    <label className="admin-field-grow">
                      <span>Description</span>
                      <input name="description" defaultValue={cat.description ?? ""} />
                    </label>
                    <label className="admin-field-narrow">
                      <span>Order</span>
                      <input
                        name="display_order"
                        type="number"
                        defaultValue={cat.display_order}
                      />
                    </label>
                  </div>

                  <div className="admin-category-meta-row">
                    <div className="admin-category-info">
                      <span className="admin-category-count">
                        {projectCount} project{projectCount !== 1 ? "s" : ""}
                      </span>
                      <span className="admin-category-divider">•</span>
                      <Link
                        href={archivePath}
                        target="_blank"
                        className="admin-category-route"
                      >
                        Public Route: {archivePath} ↗
                      </Link>
                    </div>

                    <div className="admin-category-actions">
                      <button type="submit" className="admin-btn-secondary">
                        Save
                      </button>

                      <ConfirmForm
                        action={deleteCategory}
                        message={`Delete category "${cat.name}"? It must have 0 assigned projects.`}
                      >
                        <input type="hidden" name="id" value={cat.id} />
                        <button
                          type="submit"
                          className="admin-btn-danger-sm"
                          disabled={projectCount > 0}
                          title={
                            projectCount > 0
                              ? "Cannot delete category with assigned projects"
                              : "Delete category"
                          }
                        >
                          Delete
                        </button>
                      </ConfirmForm>
                    </div>
                  </div>
                </form>

                {/* Assigned Projects list */}
                {projectCount > 0 && (
                  <div className="admin-category-projects">
                    <span className="admin-category-projects-title">Assigned Projects:</span>
                    <div className="admin-category-project-tags">
                      {cat.projects?.map((project) => (
                        <Link
                          key={project.id}
                          href={`/admin/projects/${project.id}/edit`}
                          className="admin-project-tag"
                        >
                          {project.title} ↗
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
