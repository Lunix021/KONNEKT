
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";

 function Chatlist({user}) {

  const navigate=useNavigate();
  
  const [chats,setChats]=useState([]);


//to load chatlist during render of page
useEffect(()=>{
 const loadchats=async ()=>{

try {
  const res=await api.get('/chat/allchat');
  console.log(res.data);
  setChats(res.data);
} 
catch (err) {
  console.log(err.response.data);
}
  }

  loadchats();
  
},[]);



  return (
    <div className="flex-1 overflow-y-auto scrollbar-none">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {chats.map((chat, i) => {
                
const otherUser = chat.members.find(
    member => member._id !== user._id
  );

                return (
                <motion.div
                  key={chat._id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                  onClick={()=>
                    navigate(`/chatroom/${chat._id}`,{state:{otherUser,user}})}
                  whileTap={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                  className="flex items-center gap-3 px-6 py-3.5 border-b border-zinc-900 cursor-pointer active:bg-white/2"
                >
                  <div className="relative shrink-0">
                    {
                       otherUser.profilePic ? (
    <img
                      src={otherUser.profilePic}
                      alt={otherUser.name}
                      className="w-13 h-13 rounded-full object-cover"
                    />
  ) : (
    <div className="w-11 h-11 rounded-full bg-indigo-500 flex items-center justify-center">
      {otherUser.name[0]}
    </div>
  )
                    }
                    
                    {/* <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${
                        chat.online ? "bg-emerald-400" : "bg-zinc-500"
                      }`}
                    /> */}
                  </div>
 
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-[15px] truncate">
                      {chat.name}
                    </p>
                    {/* <p className="text-zinc-500 text-[13px] truncate">{chat.msg}</p> */}
                  </div>
 
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {/* <span className="text-zinc-500 text-[11px]">{chat.time}</span> */}
                    {/* {chat.unread > 0 ? (
                      <span className="w-5 h-5 rounded-full bg-indigo-500 text-white text-[11px] font-semibold flex items-center justify-center">
                        {chat.unread}
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-500 text-[11px] font-semibold flex items-center justify-center">
                        0
                      </span>
                    )} */}
                  </div>
                </motion.div>
              )})}
            </motion.div>
          </AnimatePresence>
        </div>
  )
}

export default Chatlist