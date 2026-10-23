"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function adminClient() {
  const supabase=await createClient();
  if(!supabase) throw new Error("CMS is not configured. Set the Supabase environment variables.");
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/admin/login");
  const {data}=await supabase.from("admin_users").select("user_id").eq("user_id",user.id).maybeSingle();
  if(!data) throw new Error("This account is not authorized to administer the portfolio.");
  return supabase;
}
const slugPattern=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function text(form:FormData,key:string){return String(form.get(key)??"").trim();}
async function verifyFileSignature(url:string,mime:string){
 const response=await fetch(url,{headers:{Range:"bytes=0-31"},cache:"no-store"});
 if(response.status!==206&&response.status!==200)throw new Error(`Storage returned HTTP ${response.status} instead of media byte range.`);
 const bytes=new Uint8Array(await response.arrayBuffer());
 const ascii=(start:number,end:number)=>String.fromCharCode(...bytes.slice(start,end));
 const valid=mime==="image/jpeg"?bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff:
  mime==="image/png"?ascii(0,8)==="\x89PNG\r\n\x1a\n":
  mime==="image/webp"?ascii(0,4)==="RIFF"&&ascii(8,12)==="WEBP":
  mime==="image/avif"?ascii(4,8)==="ftyp"&&["avif","avis","mif1","msf1"].includes(ascii(8,12)):
  mime==="video/mp4"?ascii(4,8)==="ftyp":
  mime==="video/webm"?bytes[0]===0x1a&&bytes[1]===0x45&&bytes[2]===0xdf&&bytes[3]===0xa3:false;
 if(!valid)throw new Error("File contents do not match the declared media type.");
}
export async function saveProject(form:FormData) {
  const supabase=await adminClient();
  const id=text(form,"id"), title=text(form,"title"), slug=text(form,"slug"), category_id=text(form,"category_id");
  if(!title || !slugPattern.test(slug) || !category_id) throw new Error("Add a title, valid slug, and category.");
  const credits=text(form,"credits").split("\n").map(line=>line.split("—").map(value=>value.trim())).filter(parts=>parts.length>1&&parts[0]&&parts.slice(1).join("—")).map(parts=>({role:parts[0],name:parts.slice(1).join("—")}));
  const payload={title,slug,category_id,description:text(form,"description"),year:text(form,"year")||null,credits,status:text(form,"status")==="published"?"published":"draft",is_featured:form.get("is_featured")==="on",display_order:Number(form.get("display_order")||0)};
  let coverId:string|undefined;
  if(payload.status==="published"&&id){const {data:items}=await supabase.from("project_media").select("id").eq("project_id",id).order("display_order").limit(1);if(!items?.length)throw new Error("Add at least one media item before publishing.");const {data:existing}=await supabase.from("projects").select("cover_media_id").eq("id",id).single();if(!existing)throw new Error("Project was not found.");if(!existing.cover_media_id)coverId=items[0].id;}
  if(payload.status==="published"&&!id)throw new Error("Save this project as a draft, add its media, then publish it.");
  const result=id ? await supabase.from("projects").update({...payload,...(coverId?{cover_media_id:coverId}:{}),published_at:payload.status==="published"?new Date().toISOString():null}).eq("id",id) : await supabase.from("projects").insert({...payload,published_at:payload.status==="published"?new Date().toISOString():null}).select("id").single();
  if(result.error) throw new Error(result.error.message);
  revalidatePath("/"); revalidatePath("/admin/projects");
  const projectId=id || (result.data && "id" in result.data ? result.data.id : "");
  if(!projectId) throw new Error("Project save did not return an id.");
  redirect(`/admin/projects/${projectId}/edit`);
}
export async function attachMedia(input:{projectId:string;media_type:"image"|"video";storage_path:string;thumbnail_path?:string;alt_text:string;width:number;height:number;mime_type:string;file_size:number}) {
 const db=await adminClient();
 const allowed=["image/jpeg","image/png","image/webp","image/avif","video/mp4","video/webm"];
 const configuredMax=Number(process.env.NEXT_PUBLIC_CMS_MAX_UPLOAD_BYTES??524288000),maxBytes=Number.isFinite(configuredMax)&&configuredMax>0?Math.min(configuredMax,524288000):524288000;
 if(!input.projectId||!new RegExp(`^${input.projectId}/[0-9a-f-]+\\.[a-z0-9]+$`,"i").test(input.storage_path)) throw new Error("Invalid project media path.");
 if(!allowed.includes(input.mime_type)||input.file_size<1||input.file_size>maxBytes||input.width<1||input.height<1) throw new Error("Media type, file size, or dimensions are invalid.");
 const fileName=input.storage_path.slice(input.projectId.length+1);
 const {data:stored,error:storageError}=await db.storage.from("portfolio-media").list(input.projectId,{search:fileName,limit:10});
 if(storageError) throw new Error(storageError.message);
 const object=stored?.find(file=>file.name===fileName);
 if(!object||Number(object.metadata?.size)!==input.file_size||object.metadata?.mimetype!==input.mime_type) throw new Error("Uploaded object metadata does not match the submitted file metadata.");
 const {data:signed}=await db.storage.from("portfolio-media").createSignedUrl(input.storage_path,60);if(!signed?.signedUrl)throw new Error("Could not validate the uploaded object.");await verifyFileSignature(signed.signedUrl,input.mime_type);
 if(input.thumbnail_path){
  const validPoster=new RegExp(`^${input.projectId}/(?:posters/)?[0-9a-f-]+\\.[a-z0-9]+$`,"i").test(input.thumbnail_path);
  if(input.media_type!=="video"||!validPoster)throw new Error("Invalid video poster path.");
  const folder=input.thumbnail_path.includes("/posters/")?`${input.projectId}/posters`:input.projectId;
  const posterName=input.thumbnail_path.split("/").pop()??"";
  const {data:posterItems,error:posterError}=await db.storage.from("portfolio-media").list(folder,{search:posterName,limit:10});
  if(posterError)throw new Error(posterError.message);
  const poster=posterItems?.find(item=>item.name===posterName);
  if(!poster||!allowed.includes(poster.metadata?.mimetype??"")||!poster.metadata?.mimetype?.startsWith("image/")||Number(poster.metadata?.size)>maxBytes)throw new Error("Video poster metadata is invalid.");
  const {data:posterSigned}=await db.storage.from("portfolio-media").createSignedUrl(input.thumbnail_path,60);
  if(!posterSigned?.signedUrl)throw new Error("Could not validate the poster image.");
  await verifyFileSignature(posterSigned.signedUrl,poster.metadata.mimetype);
 }
 const {data,error}=await db.from("project_media").insert({...input,display_order:Date.now()}).select("id").single();
 if(error) throw new Error(error.message); revalidatePath(`/admin/projects/${input.projectId}/edit`); revalidatePath("/admin/media"); return data;
}
export async function setCover(form:FormData){const db=await adminClient();const projectId=text(form,"project_id"),mediaId=text(form,"media_id");const {data:media}=await db.from("project_media").select("id").eq("id",mediaId).eq("project_id",projectId).maybeSingle();if(!media)throw new Error("Cover media must belong to this project.");const {error}=await db.from("projects").update({cover_media_id:mediaId}).eq("id",projectId);if(error)throw new Error(error.message);revalidatePath("/");}
export async function removeMedia(input:{id:string;projectId:string}){const db=await adminClient();const {data,error}=await db.from("project_media").select("storage_path,thumbnail_path").eq("id",input.id).eq("project_id",input.projectId).single();if(error)throw new Error(error.message);const {error:delError}=await db.from("project_media").delete().eq("id",input.id);if(delError)throw new Error(delError.message);const paths=[data.storage_path,data.thumbnail_path].filter((x):x is string=>Boolean(x));if(paths.length){const {error:storageError}=await db.storage.from("portfolio-media").remove(paths);if(storageError){await db.from("storage_cleanup_queue").insert({storage_paths:paths,failure_message:storageError.message});console.error("CMS_MEDIA_CLEANUP_REQUIRED",input.id,paths,storageError.message);}}revalidatePath(`/admin/projects/${input.projectId}/edit`);revalidatePath("/admin/media");revalidatePath("/");}
export async function reorderProjectMedia(input:{projectId:string;ids:string[]}){const db=await adminClient();if(input.ids.length>200||new Set(input.ids).size!==input.ids.length)throw new Error("Invalid media ordering.");const {data:media}=await db.from("project_media").select("id").eq("project_id",input.projectId);if(!media||media.length!==input.ids.length||media.some(item=>!input.ids.includes(item.id)))throw new Error("Media order does not match this project.");for(let i=0;i<input.ids.length;i++){const {error}=await db.from("project_media").update({display_order:i}).eq("id",input.ids[i]).eq("project_id",input.projectId);if(error)throw new Error(error.message);}revalidatePath(`/admin/projects/${input.projectId}/edit`);revalidatePath("/");}
export async function deleteProject(form:FormData) {
  const supabase=await adminClient(); const id=text(form,"id");
  const {data:media,error:mediaError}=await supabase.from("project_media").select("storage_path,thumbnail_path").eq("project_id",id);
  if(mediaError)throw new Error(mediaError.message);
  const {error}=await supabase.from("projects").delete().eq("id",id);
  if(error) throw new Error(error.message);
  const paths=(media??[]).flatMap(m=>[m.storage_path,m.thumbnail_path].filter((p):p is string=>Boolean(p)));
  if(paths.length) { const {error:storageError}=await supabase.storage.from("portfolio-media").remove(paths); if(storageError) { await supabase.from("storage_cleanup_queue").insert({storage_paths:paths,failure_message:storageError.message}); console.error("CMS_MEDIA_CLEANUP_REQUIRED",id,paths,storageError.message); } }
  revalidatePath("/"); revalidatePath("/admin/projects");
}
export async function saveCategory(form:FormData) {
  const supabase=await adminClient(); const id=text(form,"id"),name=text(form,"name"),slug=text(form,"slug");
  if(!name || !slugPattern.test(slug)) throw new Error("Enter a category name and valid lowercase slug.");
  const payload={name,slug,description:text(form,"description"),display_order:Number(form.get("display_order")||0)};
  const result=id?await supabase.from("categories").update(payload).eq("id",id):await supabase.from("categories").insert(payload);
  if(result.error) throw new Error(result.error.message);
  revalidatePath("/"); revalidatePath("/admin/categories");
}
export async function deleteCategory(form:FormData) {
  const supabase=await adminClient(); const id=text(form,"id");
  const {count}=await supabase.from("projects").select("id",{count:"exact",head:true}).eq("category_id",id);
  if(count) throw new Error(`This category still has ${count} project(s). Reassign them before deleting.`);
  const {error}=await supabase.from("categories").delete().eq("id",id);
  if(error) throw new Error(error.message);
  revalidatePath("/"); revalidatePath("/admin/categories");
}
export async function setProjectStatus(form:FormData) {
  const supabase=await adminClient(); const id=text(form,"id"),status=text(form,"status")==="published"?"published":"draft";
  if(status==="published"){const {data:items}=await supabase.from("project_media").select("id").eq("project_id",id).limit(1);if(!items?.length)throw new Error("Add at least one media item before publishing.");}
  const {error}=await supabase.from("projects").update({status,published_at:status==="published"?new Date().toISOString():null}).eq("id",id);
  if(error) throw new Error(error.message);
  revalidatePath("/"); revalidatePath("/admin/projects");
}
export async function retryStorageCleanup(form:FormData){const db=await adminClient();const id=text(form,"id");const {data,error}=await db.from("storage_cleanup_queue").select("id,storage_paths").eq("id",id).is("resolved_at",null).single();if(error)throw new Error(error.message);const {error:removeError}=await db.storage.from("portfolio-media").remove(data.storage_paths);if(removeError){await db.from("storage_cleanup_queue").update({failure_message:removeError.message}).eq("id",id);throw new Error(removeError.message);}const {error:updateError}=await db.from("storage_cleanup_queue").update({resolved_at:new Date().toISOString()}).eq("id",id);if(updateError)throw new Error(updateError.message);revalidatePath("/admin/media");}
