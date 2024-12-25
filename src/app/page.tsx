'use client'
import axios from "axios";
import React from "react";

export default function Home() {

  const [gitHandle, setGitHandle] = React.useState<string>("");
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const res = axios.get(`/api/roast?handle=${gitHandle}`);
    console.log(res);
  };
  return (
    <main className="h-[calc(100vh-23px)] flex justify-center bg-zinc-900 items-center w-screen">

    <div className="flex items-center gap-10 flex-col bg-gray-100 p-10 rounded-lg">
      <h1 className="text-4xl font-bold">Get Roasted 🔥</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        <input type="text" className="p-3 rounded-lg border border-slate-600" placeholder="Github Username" onChange={e => setGitHandle(e.target.value)}/>
        <button type="submit" className="p-3 bg-slate-300 hover:bg-slate-600 transition-colors rounded-lg text-xl font-bold">Roast 😈</button>
      </form>
    </div>
    </main>
  );
}
