"use client";
export default function ConfirmForm({action,children,message="Are you sure?",className}:{action:(data:FormData)=>void;children:React.ReactNode;message?:string;className?:string}){
 return <form action={action} className={className} onSubmit={event=>{if(!window.confirm(message))event.preventDefault();}}>{children}</form>;
}
