"use client";
import { useEffect,useState } from "react";
export default function UnsavedGuard({children}:{children:React.ReactNode}){
 const [dirty,setDirty]=useState(false);
 useEffect(()=>{if(!dirty)return;const warn=(event:BeforeUnloadEvent)=>{event.preventDefault();event.returnValue="";};window.addEventListener("beforeunload",warn);return()=>window.removeEventListener("beforeunload",warn);},[dirty]);
 return <div onInput={()=>setDirty(true)} onChange={()=>setDirty(true)} onSubmit={()=>setDirty(false)}>{children}</div>;
}
