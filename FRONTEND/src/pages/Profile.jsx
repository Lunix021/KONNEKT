import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Pencil,
  MoreHorizontal,
  
  LayoutGrid,
  Clapperboard,
  Bookmark,
  User,
  Heart,
  BadgeCheck,
} from "lucide-react";

import api from "../../api/axios";

const profile = {
  name: "Gautam Mishra",
  avatar: "https://i.pravatar.cc/300?img=13",
  online: true,
  stats: [
    { label: "Posts", value: "42" },
    { label: "Followers", value: "1.2K" },
    { label: "Following", value: "236" },
    { label: "Likes", value: "8.3K" },
    { label: "Reels", value: "12" },
  ],
};

const tabs = [
  { id: "posts", label: "Posts", icon: LayoutGrid },
  { id: "reels", label: "Reels", icon: Clapperboard },
  { id: "saved", label: "Saved", icon: Bookmark },
  { id: "about", label: "About", icon: User },
];

const posts = [
  { id: 1, img: "https://picsum.photos/id/1018/500/500", likes: 342 },
  { id: 2, img: "https://picsum.photos/id/60/500/500", likes: 512 },
  { id: 3, img: "https://picsum.photos/id/1062/500/500", likes: 678 },
  { id: 4, img: "https://picsum.photos/id/1043/500/500", likes: 423 },
  { id: 5, img: "https://picsum.photos/id/48/500/500", likes: 289 },
  { id: 6, img: "https://picsum.photos/id/1036/500/500", likes: 345 },
  { id: 7, img: "https://picsum.photos/id/180/500/500", likes: 601 },
  { id: 8, img: "https://picsum.photos/id/1074/500/500", likes: 712 },
];



export default function Profile() {
  const [activeTab, setActiveTab] = useState("posts");
  const formData=new FormData();
  const imgref=useRef();

  const clickimg=()=>{imgref.current.click();}

  const handleimg=async (e)=>{
    const file=e.target.files[0];
    formData.append("image",file);
    await api.post('/upload',formData);
  }

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans px-8 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Top card */}
        <div className="relative bg-zinc-950 border border-zinc-900 rounded-3xl p-8">
          {/* Top-right actions */}
          <div className="absolute top-6 right-6 flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 bg-zinc-800/70 hover:bg-zinc-800 transition-colors px-4 py-2 rounded-full text-sm font-medium"
            >
              <Pencil size={14} />
              Edit Profile
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              className="w-9 h-9 rounded-full bg-zinc-800/70 hover:bg-zinc-800 transition-colors flex items-center justify-center"
              aria-label="More options"
            >
              <MoreHorizontal size={16} />
            </motion.button>
          </div>

          {/* Identity row */}
          <div className="flex items-start gap-6">
            <div className="relative shrink-0">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-zinc-800" onClick={clickimg}
              />
              <input ref={imgref} type='file' accept="image/*" onChange={handleimg} className="hidden"/>
              {profile.online && (
                <span className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-400 border-4 border-zinc-950" />
              )}
            </div>

            <div className="pt-1">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight">{profile.name}</h1>
                
              </div>
              

              

             
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-7 bg-zinc-900/60 border border-zinc-800/60 rounded-2xl py-5 flex items-center justify-around">
            {profile.stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-10 mt-6 border-b border-zinc-900 px-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex items-center gap-2 pb-4"
              >
                <Icon size={16} className={isActive ? "text-indigo-400" : "text-zinc-500"} />
                <span
                  className={`text-sm font-medium ${
                    isActive ? "text-indigo-400" : "text-zinc-500"
                  }`}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="profile-tab-underline"
                    className="absolute -bottom-px left-0 right-0 h-0.5 bg-indigo-500 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "posts" && (
            <motion.div
              key="posts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-4 gap-4 mt-6"
            >
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-zinc-900 cursor-pointer group"
                >
                  <img
                    src={post.img}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/0 to-black/0" />
                  <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-sm font-medium">
                    <Heart size={14} fill="white" />
                    {post.likes}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "reels" && (
            <motion.div
              key="reels"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-24 text-zinc-600 text-sm"
            >
              No reels to show yet.
            </motion.div>
          )}

          {activeTab === "saved" && (
            <motion.div
              key="saved"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-24 text-zinc-600 text-sm"
            >
              Nothing saved yet.
            </motion.div>
          )}

          {activeTab === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 max-w-lg text-sm text-zinc-400 leading-relaxed"
            >
              HEHE WAIT FOR NEXT VERSION.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}