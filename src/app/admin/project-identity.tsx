"use client";
import { useState } from "react";
function toSlug(value:string){return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");}
export default function ProjectIdentity({title="",slug=""}:{title?:string;slug?:string}){
 const [currentTitle,setTitle]=useState(title),[currentSlug,setSlug]=useState(slug),[edited,setEdited]=useState(Boolean(slug));
 return <><label>Title<input name="title" required maxLength={160} value={currentTitle} onChange={e=>{setTitle(e.target.value);if(!edited)setSlug(toSlug(e.target.value));}}/></label><label>Slug<input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={currentSlug} onChange={e=>{setEdited(true);setSlug(toSlug(e.target.value));}}/><small>Lowercase letters, numbers and hyphens.</small></label></>;
}
