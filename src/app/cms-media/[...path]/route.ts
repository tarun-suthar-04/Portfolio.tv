import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
export const dynamic="force-dynamic";
export async function GET(_request:Request,{params}:{params:Promise<{path:string[]}>}){
 const {path}=await params;const key=path.map(decodeURIComponent).join("/");
 if(!key||key.includes(".."))return new NextResponse("Not found",{status:404});
 const db=await createClient();if(!db)return new NextResponse("Not found",{status:404});
 await db.auth.getUser();
 const {data,error}=await db.storage.from("portfolio-media").createSignedUrl(key,3600);
 if(error||!data?.signedUrl)return new NextResponse("Not found",{status:404});
 return NextResponse.redirect(data.signedUrl,{status:302,headers:{"Cache-Control":"private, no-store"}});
}
