import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Phone,
  Video,
  EllipsisVertical,
  Paperclip,
  ImagePlus,
  ArrowUp,
  Check,
  CheckCheck,
} from "lucide-react";
import { useParams,useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import socket from "../../socket";

function MessageRow({ msg, isMe }) {
  
  const accent = isMe ? "border-indigo-500" : "border-violet-400";
  const date=new Date(msg.createdAt);
  return (
    <motion.div
      initial={{ opacity: 0, x: isMe ? 12 : -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-[70%] rounded-xl bg-zinc-900 px-4 py-2 border ${accent}`}>

        {/* {msg.type === "image" && (
          <img
            src={msg.img}
            alt=""
            className="max-w-56 rounded-lg"
          />
        )} */}

        {msg.text && (
          <p className={` font-semibold ${isMe ? "text-indigo-400" : "text-violet-300"}`}>{msg.text}</p>
        )}

        <span className="text-[10px] text-zinc-500">
          {date.toLocaleString("default",{
            weekday:"short",
            hour:"2-digit",
            minute:"2-digit"
          })}
        </span>

      </div>
    </motion.div>
  );
}



function TypingRow({otherUser}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative pl-10"
    >
      <motion.span
        className="absolute left-4.75 top-2 w-2 h-2 rounded-full bg-violet-400 ring-4 ring-black"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <div className="rounded-r-lg rounded-l-sm border-l-2 border-violet-400 bg-zinc-900/50 pl-4 pr-4 py-2.5">
        <span className="text-[11px] font-mono text-zinc-500 tracking-wider">
          {otherUser.name.split(" ")[0]} is typing
        </span>
      </div>
    </motion.div>
  );
}



export default function Chatroom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
 const navigate=useNavigate();
  const {chatId}=useParams();
  const location = useLocation();
 const otherUser = location.state?.otherUser;
const user=location.state?.user;

//check user and other user uisng console if THey are undefined or not

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage =async () => {
    if (!input.trim()) return;
    try {

        const res = await api.post("/message/send", {
             chatId:chatId,
            text: input
        });

        setInput("");

    } catch (err) {
        console.log(err);
    }
  
  };




//LOading entire chat when page is rendered
useEffect(()=>{
  const loadroom=async()=>{
 try {
  const res=await api.get(`/message/${chatId}`);
  console.log(res.data);
  setMessages(res.data);
  socket.emit("joinroom",chatId);
 } catch (err) {
  console.log(err.response.data);
 }
  }
  loadroom();
},[chatId]);



useEffect(()=>{
  const handlemessage=(msg)=>{
    setMessages(prev=>[...prev,msg]);
  };
 socket.on("connect", () => {
        console.log("CONNECTED TO SOCKET:", socket.id);
    });
socket.on("newMessage",handlemessage);

return ()=>{
  socket.off("newMessage",handlemessage);
    socket.off("connect");
}

},[]);




  return (
      <div className="relative w-full  h-205 bg-zinc-950/90 backdrop-blur border border-zinc-900  overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-900 shrink-0">
          <button
            className="w-8 h-8 rounded-md bg-zinc-900/60 hover:bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            aria-label="Back" onClick={()=>navigate('/chats')}
          >
            <ChevronLeft size={18} />
          </button>

          <div className="relative shrink-0">
            
            {
  otherUser.profilePic ? (
    <img
      src={otherUser.profilePic}
      alt={otherUser.name}
      className="w-11 h-11 rounded-full object-cover"
    />
  ) : (
    <div className="w-11 h-11 rounded-full bg-indigo-500 flex items-center justify-center">
      {otherUser.name[0]}
    </div>
  )
}
            {/* {contact.online && (
              <motion.span
                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-zinc-950"
                animate={{ boxShadow: ["0 0 0 0 rgba(52,211,153,0.5)", "0 0 0 6px rgba(52,211,153,0)"] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
            )} */}
          </div>

          {/* <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{user.name}</p>
            <p className="text-[11px] font-mono text-zinc-500 tracking-wide">
              {typing ? <span className="text-violet-300">typing…</span> : contact.handle}
            </p>
          </div> */}

          {/* <div className="flex items-center gap-1.5">w
            {[Phone, Video, EllipsisVertical].map((Icon, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.9 }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                className="w-8 h-8 rounded-md flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                aria-label="action"
              >
                <Icon size={16} />
              </motion.button>
            ))}
          </div> */}
        </div>

        {/* Timeline feed */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 scrollbar-none">
          <div className="relative">
            {/* vertical spine */}
            <div className="absolute left-5.75 top-1 bottom-1 w-px bg-linear-to-b from-zinc-800 via-zinc-800 to-transparent" />

            <div className="flex flex-col gap-4">
              {/* <div className="pl-10 mb-1">
                <span className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase">— Today —</span>
              </div> */}

              <AnimatePresence initial={false}>
                {messages.map((msg, i) => {

                const isMe = String(user?._id) === String(msg.sender?._id);
           
                  return <MessageRow key={msg._id} msg={msg} isMe={isMe} />;
                })}
                {typing && <TypingRow key="typing" otherUser={otherUser}/>}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Compose */}
        <div className="px-5 py-4 border-t border-zinc-900 shrink-0">
          <div className="flex items-end gap-2 bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 py-2.5 focus-within:border-indigo-500/60 transition-colors">
            <span className="text-indigo-400 font-mono text-sm pb-1.5 select-none">›</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              type="text"
              placeholder="type your message here"
              className="flex-1 bg-transparent outline-none text-sm font-mono 
              text-zinc-300
              placeholder:text-zinc-500 py-1"
            />
            {/* <button className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors" aria-label="Attach">
              <Paperclip size={15} />
            </button>
            <button className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors" aria-label="Image">
              <ImagePlus size={15} />
            </button> */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.05 }}
              onClick={sendMessage}
              disabled={!input.trim()}
              className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                input.trim() ? "bg-indigo-500 hover:bg-indigo-400 text-white" : "bg-zinc-800 text-zinc-600"
              }`}
              aria-label="Send"
            >
              <ArrowUp size={15} />
            </motion.button>
          </div>
        </div>
      </div>
    
  );
}