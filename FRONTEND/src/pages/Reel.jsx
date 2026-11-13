import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus,TrendingUp,UserCheck, Users,Heart,MessageCircle,Share2,Bookmark,Volume2,VolumeX,Play,ChevronLeft,ChevronRight,Send,BadgeCheck,} from "lucide-react";
 import api from "../../api/axios";

const filters = [
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "following", label: "Following", icon: UserCheck },
  { id: "friends", label: "Friends", icon: Users },
];

 
export default function Reel() {
  const [reels,setReels]=useState([]);
  const [activeFilter, setActiveFilter] = useState("trending");
  const [activeIndex, setActiveIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [muted, setMuted] = useState(true);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const videoref=useRef();
 
  const reel = reels[activeIndex];
  const wheelLock = useRef(false);
 
  const goTo = (dir) => {
    setLiked(false);
    setSaved(false);
    setActiveIndex((prev) => {
      const next = prev + dir;
      if (next < 0) return reels.length - 1;
      if (next >= reels.length) return 0;
      return next;
    });
  };

  //mouse scroll == Reel change function
  const handleWheel = (e) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (wheelLock.current || Math.abs(delta) < 12) return;
    wheelLock.current = true;
    goTo(delta > 0 ? 1 : -1);
    setTimeout(() => {
      wheelLock.current = false;
    }, 550);
  };
 


  //add a comment
  const submitComment = async() => {
    if (!comment.trim()) return;
    try {
      const res=await api.post(`/reel/addcomment/${reel._id}`,{text:comment});
      console.log(res.data);
      setComments((c) => [...c,res.data.comments]);
       setComment("");
    } catch (err) {
      console.log(err.response.data);
    }
    
   
  };





  //like a reel 
  const likereel=async()=>{
     try {
      const res=await api.patch(`/reel/like/${reel._id}`);
      console.log(res.data);
    } catch (err) {
      console.log(err.response.data);
    }
  }




 

//fetch all reels for feed
// we currently just take all reels and show it but we might change the system in future to a recommendation system or a api call each time u change reel cuz calling every reel at once seems overload for me, will see what view chatgpt has on it
useEffect(()=>{
  const loadreels=async()=>{
      try {
        const res=await api.get('/reel/getall');
        console.log(res.data);
        setReels(res.data);
      } catch (err) {
        console.log(err.response.data);
      }
  }
  loadreels();
},[]);



//comments loader for each reel
useEffect(() => {
  if (reel) {
    setComments(reel.comments || []);
  }
}, [reel]);




//play and pause reel
const toggleplay=()=>{
   if (videoref.current.paused) {
    videoref.current.play();
   
  } else {
    videoref.current.pause();

  }
}


//so that ui doesnt load before reel gets to the state 
if (!reel) {
  return <div className="h-screen bg-black text-white">Loading...</div>;
}

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-zinc-900 shrink-0">
        <h1 className="text-2xl font-extrabold tracking-tight">
          KONNEKT<span className="text-indigo-500">.</span>
        </h1>
        <motion.button
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.05 }}
          className="w-9 h-9 rounded-full border border-white/80 flex items-center justify-center text-white"
          aria-label="Create reel"
        >
          <Plus size={18} strokeWidth={2.5} />
        </motion.button>
      </div>
 
      {/* Body: 3 columns */}
      <div className="flex flex-1 min-h-0">
        {/* Left rail — filters */}
        <aside className="w-56 shrink-0 border-r border-zinc-900 p-6 flex flex-col gap-1">
          {filters.map((f) => {
            const isActive = activeFilter === f.id;
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className="relative flex items-center gap-3 px-4 py-3 rounded-full text-left"
              >
                {isActive && (
                  <motion.div
                    layoutId="reels-filter-pill"
                    className="absolute inset-0 bg-indigo-950/60 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon
                  size={18}
                  className={`relative z-10 ${isActive ? "text-indigo-300" : "text-zinc-500"}`}
                />
                <span
                  className={`relative z-10 text-sm font-medium ${
                    isActive ? "text-indigo-300" : "text-zinc-400"
                  }`}
                >
                  {f.label}
                </span>
              </button>
            );
          })}
        </aside>
 
        {/* Center — reel player */}
        <main
          className="flex-1 flex items-center justify-center relative py-8 bg-zinc-950/40"
          onWheel={handleWheel}
        >
          <div className="relative flex items-center gap-6">
            {/* Prev */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => goTo(-1)}
              className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white shrink-0"
              aria-label="Previous reel"
            >
              <ChevronLeft size={20} />
            </motion.button>
 
            <AnimatePresence mode="wait">
              <motion.div
                key={reel._id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className="relative w-95 h-170 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl"
              >
                <video
                ref={videoref}
                  src={reel.videourl}
                  alt={reel.caption}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/0 to-black/40" />
 
                {/* Progress segments */}
                <div className="absolute top-4 left-4 right-4 flex gap-1.5">
                  {reels.map((r, i) => (
                    <div key={r._id} className="h-1 flex-1 rounded-full bg-white/25 overflow-hidden">
                      {i === activeIndex && (
                        <motion.div
                          className="h-full bg-white"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 6, ease: "linear" }}
                        />
                      )}
                      {i < activeIndex && <div className="h-full w-full bg-white" />}
                    </div>
                  ))}
                </div>
 
                {/* Mute toggle */}
                <button
                  onClick={() => {setMuted((m) => !m); videoref.current.muted=!videoref.current.muted;
                  }}
                  className="absolute top-9 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white"
                >
                  {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
 
                {/* Center play glyph (decorative) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-14 h-14 rounded-full bg-black/30 backdrop-blur flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  onClick={toggleplay}>
                    <Play size={22} className="text-white ml-0.5" fill="white" />
                  </button>
                </div>
 
                {/* Bottom creator + caption */}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-center gap-3">
                  <img
                    src={reel.user_uploaded.profilePic}
                    alt={reel.user_uploaded.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-violet-400"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold flex items-center gap-1">
                      {reel.user_uploaded.profilePic}
                      {/* {reel.verified && <BadgeCheck size={13} className="text-indigo-400" />} */}
                    </p>
                    <p className="text-xs text-zinc-300 truncate max-w-60">{reel.caption}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
 
            {/* Next */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => goTo(1)}
              className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white shrink-0"
              aria-label="Next reel"
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </main>
 
        {/* Right rail — creator profile, actions, comments */}
        <aside className="w-96 shrink-0 border-l border-zinc-900 flex flex-col min-h-0">
          {/* Creator profile card */}
          <div className="p-6 border-b border-zinc-900">
            <div className="flex items-center gap-3">
              <img
                src={reel.user_uploaded.profilePic}
                alt={reel.user_uploaded.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-violet-400"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold flex items-center gap-1">
                  {reel.user_uploaded.profilePic}
                  {/* {reel.verified && <BadgeCheck size={13} className="text-indigo-400" />} */}
                </p>
                {/* <p className="text-xs text-zinc-500 truncate">{reel.handle}</p> */}
              </div>
              <motion.button
                whileTap={{ scale: 0.92 }}
                className="text-xs font-semibold bg-indigo-500 hover:bg-indigo-400 transition-colors px-4 py-2 rounded-full text-white"
              >
                Make Friend
              </motion.button>
            </div>
 
            {/* Action icons */}
            <div className="flex items-center gap-6 mt-5">
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => {setLiked((v) => !v); likereel();}}
                className="flex flex-col items-center gap-1"
              >
                <motion.div animate={liked ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
                  <Heart
                    size={22}
                    className={liked ? "text-rose-500" : "text-zinc-300"}
                    fill={liked ? "currentColor" : "none"}
                  />
                </motion.div>
                <span className="text-[11px] text-zinc-500">
                  {(reel.likes + (liked ? 1 : 0)).toLocaleString()}
                </span>
              </motion.button>
 
              <div className="flex flex-col items-center gap-1">
                <MessageCircle size={22} className="text-zinc-300" />
                <span className="text-[11px] text-zinc-500">{comments.length}</span>
              </div>
 
              {/* <motion.button whileTap={{ scale: 0.8 }} className="flex flex-col items-center gap-1">
                <Share2 size={21} className="text-zinc-300" />
                <span className="text-[11px] text-zinc-500">{reel.shares}</span>
              </motion.button> */}
 
              {/* <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => setSaved((v) => !v)}
                className="flex flex-col items-center gap-1 ml-auto"
              >
                <Bookmark
                  size={21}
                  className={saved ? "text-indigo-400" : "text-zinc-300"}
                  fill={saved ? "currentColor" : "none"}
                />
                <span className="text-[11px] text-zinc-500">Save</span>
              </motion.button> */}
            </div>
          </div>
 
          {/* Comments */}
          <div className="flex-1 flex flex-col min-h-0">
            <p className="px-6 pt-4 pb-2 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
              Comments · {comments.length}
            </p>
            <div className="flex-1 overflow-y-auto px-6 flex flex-col gap-4 scrollbar-none pb-4">
              {comments.map((c) => (
                <div key={c._id} className="flex gap-3">
                  <img src={c.by.profilePic} alt={c.by.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm">
                      <span className="font-semibold mr-1.5">{c.by.name}</span>
                      <span className="text-zinc-300">{c.text}</span>
                    </p>
                    <p className="text-[11px] text-zinc-600 mt-0.5">{c.time}</p>
                  </div>
                </div>
              ))}
            </div>
 
            {/* Comment input */}
            <div className="p-4 border-t border-zinc-900 flex items-center gap-2 shrink-0">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitComment()}
                type="text"
                placeholder="Add a comment..."
                className="flex-1 bg-zinc-900/80 border border-zinc-800/60 rounded-full px-4 py-2.5 text-sm outline-none placeholder:text-zinc-500"
              />
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={submitComment}
                className="w-9 h-9 rounded-full bg-indigo-500 hover:bg-indigo-400 transition-colors flex items-center justify-center shrink-0"
              >
                <Send size={15} className="text-white" />
              </motion.button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}