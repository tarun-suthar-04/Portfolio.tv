import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/admin/login/actions";

import AdminNav from "@/app/admin/admin-nav";

export default async function AdminLayout({children}:{children:React.ReactNode}) {
  const supabase=await createClient();
  if(!supabase) return <main className="admin-login"><p className="eyebrow">TARUN / VISUAL WORKS</p><h1>CMS setup required</h1><p>Configure the Supabase URL and publishable key, then apply the SQL migration and create an administrator.</p></main>;
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/admin/login");
  const {data:admin}=await supabase.from("admin_users").select("user_id").eq("user_id",user.id).maybeSingle();
  if(!admin) redirect("/admin/login?error=unauthorized");
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand">TARUN <span>/ VISUAL WORKS</span></Link>
        <AdminNav />
        <Link className="admin-view" href="/">View Portfolio ↗</Link>
        <form action={logout}><button className="admin-logout">Log out</button></form>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
