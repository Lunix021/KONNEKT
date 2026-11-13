import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Chatlist from "./Chatlist";
import Requestlist from "./Requestlist";
import api from "../../../api/axios";

const stories = [
  { id: "note", name: "Your note", isNote: true, avatar: "https://i.pravatar.cc/150?img=12" },
  { id: "rahul", name: "Rahul", avatar: "https://i.pravatar.cc/150?img=13", ring: "ring-emerald-400", dot: "bg-emerald-400" },
  { id: "aman", name: "Aman", avatar: "https://i.pravatar.cc/150?img=14", ring: "ring-violet-400", dot: "bg-emerald-400" },
  { id: "sarah", name: "Sarah", avatar: "https://i.pravatar.cc/150?img=45", ring: "ring-emerald-400", dot: "bg-emerald-400" },
  { id: "priya", name: "Priya", avatar: "https://i.pravatar.cc/150?img=47", ring: "ring-violet-400", dot: "bg-zinc-500" },
  { id: "karan", name: "Karan", avatar: "https://i.pravatar.cc/150?img=15", ring: "ring-zinc-600", dot: "bg-zinc-500" },
];
 

const tabs = [
  { id: "all", label: "All Chats", count: 7 },
  { id: "friends", label: "Friends", count: 3 },
  { id: "requests", label: "Requests", count: 1 },
];
 

 

 
export default function Body({user}) {
  const [activeTab, setActiveTab] = useState("all");

  const navigate=useNavigate();
 
  return (
   
      <div className="relative w-full  min-h-screen   bg-zinc-950 p-4 font-sans  shadow-2xl overflow-hidden flex flex-col">
        
        
 
        {/* Search bar */}
        <div className="px-6 pb-5">
          <div className="flex items-center gap-3 bg-zinc-900/80 rounded-full px-4 py-3 border border-zinc-800/60">
            <Search size={18} className="text-zinc-500 shrink-0" />
            <input
              type="text"
              placeholder="Search chats or friends..."
              className="bg-transparent outline-none text-sm text-zinc-200 placeholder:text-zinc-500 w-full"
            />
            <SlidersHorizontal size={16} className="text-zinc-500 shrink-0" />
          </div>
        </div>
 
        {/* Stories */}
        {/* <div className="flex gap-4 px-6 py-5 overflow-x-auto scrollbar-none">
          {stories.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              whileTap={{ scale: 0.92 }}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <div className="relative">
                <div
                  className={`w-16 h-16 rounded-full p-0.5 ${
                    s.isNote ? "" : `ring-2 ${s.ring}`
                  }`}
                >
                  <img
                    src={s.avatar}
                    alt={s.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                {s.isNote ? (
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-indigo-500 border-2 border-black flex items-center justify-center">
                    <Plus size={11} className="text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <div
                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ${s.dot} border-2 border-black`}
                  />
                )}
              </div>
              <span className="text-[11px] text-zinc-300 max-w-16 truncate">
                {s.name}
              </span>
            </motion.div>
          ))}
        </div> */}
 
        {/* Tabs */}
        <div className="flex items-center gap-2 px-6 pb-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex items-center gap-2 px-1 py-2"
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-pill"
                    className="absolute inset-0 bg-indigo-950/60 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span
                  className={`relative z-10 text-sm font-medium px-3 ${
                    isActive ? "text-indigo-300" : "text-zinc-400"
                  }`}
                >
                  {tab.label}
                </span>
                <span
                  className={`relative z-10 -ml-2 mr-2 w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-semibold ${
                    isActive
                      ? "bg-indigo-500 text-white"
                      : "bg-zinc-800 text-zinc-300"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
 
 
        {/* Chat list */}
        {activeTab==="requests"?<Requestlist/>:<Chatlist user={user}/>}
 
        
      </div>
   
  );
}