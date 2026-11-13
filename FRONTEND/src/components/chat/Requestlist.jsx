import React, { useState,useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Check, X, Users, UserPlus, Send } from "lucide-react";
import Addfriend from "./Addfriend";
import api from "../../../api/axios";




function RequestCard({ req, onAccept, onDecline }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border-l-2 border-indigo-500 bg-zinc-900/50 border  p-4 flex items-center gap-4"
    >
      <img src={req.profilePic} alt={req.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
 
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-white truncate">{req.name}</p>          
        </div>
        
 
       
 
        <div className="flex items-center gap-2 mt-3">
          <motion.button
            whileTap={{ scale: 0.94 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => onAccept(req)}
            className="flex items-center justify-center gap-1.5 bg-indigo-500 hover:bg-indigo-400 transition-colors text-white text-xs font-semibold px-4 py-2 rounded-md"
          >
            <Check size={13} />
            Accept
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => onDecline(req)}
            className="flex items-center justify-center gap-1.5 bg-zinc-800/70 hover:bg-rose-500/10 hover:text-rose-400 transition-colors text-zinc-300 text-xs font-semibold px-4 py-2 rounded-md"
          >
            <X size={13} />
            Decline
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
 
function SentCard({ req, onCancel }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border-l-2 border-violet-400 bg-zinc-900/50 border p-4 flex items-center gap-4"
    >
      <img src={req.profilePic} alt={req.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{req.name}</p>
       
      </div>

      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={() => onCancel(req)}
        className="text-xs font-semibold text-zinc-400 hover:text-rose-400 transition-colors border border-zinc-800 hover:border-rose-500/40 px-3 py-1.5 rounded-md shrink-0"
      >
        Cancel
      </motion.button>
    </motion.div>
  );
}









 
export default function Requestlist() {
  const [tab, setTab] = useState("received");
  const [received, setReceived] = useState([]);
  const [toast, setToast] = useState(null);
   const [open, setOpen] = useState(false);
   const [sent,setSent]=useState([]);
 
  const flashToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(null), 2200);
  };
 
  const handleAccept = async (req) => {
      try {
        const res=await api.patch(`/friend/acceptrequest/${req._id}`);
        console.log(res.data);
               setReceived((r) => r.filter((x) => x.id !== req._id));
    flashToast(`You and ${req.name.split(" ")[0]} are now connected`);
        } catch (err) {
            console.log(err.response.data);
        }

  };
 
  const handleDecline = async(req) => {


    try {
        const res=await api.patch(`/friend/rejectrequest/${req._id}`);
        console.log(res.data);
                setReceived((r) => r.filter((x) => x.id !== req._id));
    flashToast(`Declined ${req.name.split(" ")[0]}'s request`);
        } catch (err) {
            console.log(err.response.data);
        }

   
  };
 

  // havent added backend route for it mb but will sure add later
  // const handleCancel = (req) => {
  //   setSent((r) => r.filter((x) => x.id !== req._id));
  //   flashToast(`Cancelled request to ${req.name.split(" ")[0]}`);
  // };


  useEffect(() => {
    const loadRequests = async () => {
        try {
            const res = await api.get('/friend/requests');
            const res2 = await api.get('/friend/sent');
            setReceived(res.data);
            setSent(res2.data);
        } catch (err) {
            console.log(err.response.data);
        }
    };

    loadRequests();
}, []);
 

  return (
  
  <> 
 
      <div className="relative w-full h-205 bg-zinc-950/90 backdrop-blur border border-zinc-900 rounded-2xl overflow-hidden flex flex-col shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-900 shrink-0">
       
          <div className="flex-1">
            <h1 className="text-base font-bold">Requests</h1>
            <p className="text-[11px] font-mono text-zinc-500">
              {received.length} pending · {sent.length} sent
            </p>
          </div>
          <div className="w-8 h-8 rounded-md bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <UserPlus size={16} onClick={()=>setOpen(true)} />
          </div>
        </div>
 
        {/* Tabs */}
        <div className="flex items-center gap-6 px-5 pt-4 border-b border-zinc-900">
          {[
            { id: "received", label: "Received", count: received.length },
            { id: "sent", label: "Sent", count: sent.length },
          ].map((t) => {
            const isActive = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} className="relative flex items-center gap-2 pb-3">
                <span className={`text-sm font-medium ${isActive ? "text-indigo-400" : "text-zinc-500"}`}>
                  {t.label}
                </span>
                <span
                  className={`text-[11px] font-mono w-5 h-5 rounded-full flex items-center justify-center ${
                    isActive ? "bg-indigo-500 text-white" : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {t.count}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="req-tab-underline"
                    className="absolute -bottom-px left-0 right-0 h-0.5 bg-indigo-500 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>
 
        {/* List */}
        <div className="flex-1 overflow-y-auto px-5 py-5 scrollbar-none">
          <AnimatePresence mode="wait">
            {tab === "received" ? (
              <motion.div key="received" className="flex flex-col gap-3">
                <AnimatePresence>
                  {received.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-24 text-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-2">
                        <UserPlus size={20} className="text-zinc-600" />
                      </div>
                      <p className="text-sm text-zinc-500">You're all caught up</p>
                      <p className="text-xs text-zinc-600">No pending requests right now</p>
                    </motion.div>
                  ) : (
                    received.map((req) => (
                      <RequestCard key={req._id} req={req} onAccept={handleAccept} onDecline={handleDecline} />
                    ))
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div key="sent" className="flex flex-col gap-3">
                <AnimatePresence>
                  {sent.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-24 text-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-2">
                        <Send size={18} className="text-zinc-600" />
                      </div>
                      <p className="text-sm text-zinc-500">No outgoing requests</p>
                    </motion.div>
                  ) : (
                    sent.map((req) => <SentCard key={req._id} req={req} onCancel={handleCancel} />)
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
 
        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 px-4 py-2.5 rounded-full shadow-lg"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      
    </div>

{
    open && <Addfriend setOpen={setOpen}/>
}

    </>   
  );
}
 

