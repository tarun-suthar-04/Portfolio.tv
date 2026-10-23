import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";
import { createClient } from "@supabase/supabase-js";

const root=process.cwd();
const require=createRequire(import.meta.url);
const source=await fs.readFile(path.join(root,"src/data/projects.ts"),"utf8");
const js=ts.transpile(source,{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022});
const catalog={exports:{}};
new Function("exports","require","module",js)(catalog.exports,require,catalog);
const projects=catalog.exports.projects;
const categories=catalog.exports.categories;
const referenced=new Set();
const assetName=(url)=>decodeURIComponent(path.basename(new URL(url,"http://portfolio.local").pathname));
for(const project of projects) for(const item of [project.cover,...project.media]) for(const url of [item.src,item.poster].filter(Boolean)) referenced.add(assetName(url));
const report={createdAt:new Date().toISOString(),projects:projects.length,categories:[...categories],assets:[...referenced].map(name=>({name,exists:false,bytes:null})),status:"validation"};
for(const asset of report.assets){try{const stat=await fs.stat(path.join(root,"public/media",asset.name));asset.exists=stat.isFile();asset.bytes=stat.size;}catch{}}
const missing=report.assets.filter(a=>!a.exists);
if(missing.length){console.error("Missing source files:",missing.map(a=>a.name));process.exitCode=1;}
const dryRun=process.argv.includes("--dry-run");
if(!dryRun&&!missing.length){
 const url=process.env.SUPABASE_URL;
 const secret=process.env.SUPABASE_SECRET_KEY;
 if(!url||!secret) throw new Error("Set SUPABASE_URL and SUPABASE_SECRET_KEY in the local environment before importing. Do not use NEXT_PUBLIC variables for the secret.");
 const db=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
 const categoryIds=new Map();
 for(let i=0;i<categories.length;i++){
  const name=categories[i],slug=name.toLowerCase(),display_order=name==="Personal"?1:name==="Commercials"?2:3;
  const {data,error}=await db.from("categories").upsert({name,slug,display_order},{onConflict:"slug"}).select("id").single();
  if(error)throw error;categoryIds.set(name,data.id);
 }
 for(const project of projects){
  const {data:row,error}=await db.from("projects").upsert({title:project.title,slug:project.slug,description:project.description??"",year:project.year?String(project.year):null,credits:project.credits??[],category_id:categoryIds.get(project.category),status:"published",is_featured:Boolean(project.featured),display_order:project.order},{onConflict:"slug"}).select("id").single();
  if(error)throw error;
  const idsBySource=new Map();
  for(let i=0;i<project.media.length;i++){
   const item=project.media[i],fileName=assetName(item.src),ext=path.extname(fileName).toLowerCase();
   const storagePath=`legacy/${project.slug}/${fileName}`;
   const bytes=await fs.readFile(path.join(root,"public/media",fileName));
   const mime=ext===".jpg"||ext===".jpeg"?"image/jpeg":ext===".png"?"image/png":ext===".webp"?"image/webp":ext===".avif"?"image/avif":ext===".webm"?"video/webm":"video/mp4";
   const {error:uploadError}=await db.storage.from("portfolio-media").upload(storagePath,bytes,{contentType:mime,upsert:true});if(uploadError)throw uploadError;
   let thumbnailPath=null;
   if(item.poster){const posterName=assetName(item.poster);thumbnailPath=`legacy/${project.slug}/${posterName}`;const poster=await fs.readFile(path.join(root,"public/media",posterName));const {error:e}=await db.storage.from("portfolio-media").upload(thumbnailPath,poster,{contentType:"image/jpeg",upsert:true});if(e)throw e;}
   const {data:media,error:mediaError}=await db.from("project_media").upsert({project_id:row.id,media_type:item.type,storage_path:storagePath,thumbnail_path:thumbnailPath,alt_text:item.alt,width:item.width,height:item.height,display_order:i,file_size:bytes.byteLength,mime_type:mime},{onConflict:"storage_path"}).select("id").single();if(mediaError)throw mediaError;
   idsBySource.set(item.src,media.id);
  }
  const coverId=idsBySource.get(project.cover.src);const {error:updateError}=await db.from("projects").update({cover_media_id:coverId}).eq("id",row.id);if(updateError)throw updateError;
 }
 report.status="imported";
}
await fs.mkdir(path.join(root,"migration"),{recursive:true});
await fs.writeFile(path.join(root,"migration/import-report.json"),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
