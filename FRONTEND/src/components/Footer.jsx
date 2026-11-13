import React,{useState} from 'react'
import {motion} from "framer-motion"
import {  MessageCircle, PlaySquare, User } from "lucide-react";
import { useNavigate } from 'react-router-dom';




const navItems = [
  { id: "chats", label: "Chats", icon: MessageCircle },
  { id: "reels", label: "Reels", icon: PlaySquare },
  { id: "profile", label: "Profile", icon: User },
];


function Footer() {
  const [activeNav, setActiveNav] = useState("chats");
  const navigate=useNavigate();

  return (
   <div className="flex items-center justify-around border-t border-zinc-900 bg-black py-3 px-6">
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                onClick={() => {setActiveNav(item.id); navigate(`/${item.label.toLowerCase()}`)}}
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center gap-1"
              >
                <Icon
                  size={22}
                  strokeWidth={2}
                  className={isActive ? "text-indigo-400" : "text-zinc-500"}
                  fill={isActive && item.id === "chats" ? "currentColor" : "none"}
                />
                <span
                  className={`text-[11px] font-medium ${
                    isActive ? "text-indigo-400" : "text-zinc-500"
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
  )
}

export default Footer