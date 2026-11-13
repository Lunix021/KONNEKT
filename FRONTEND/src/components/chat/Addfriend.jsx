import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; 
import { Search, X, UserPlus, Check, ArrowLeft, MapPin, Calendar, BadgeCheck, MessageCircle, Users as UsersIcon, } from "lucide-react"; 
import api from "../../../api/axios";

export default function Addfriend({ setOpen }) {

  const [query, setQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  const sendfrndrqst=async(id)=>{
    try {
      const res = await api.patch(`/friend/sendrequest/${id}`);

     console.log(res.data);

    } catch (err) {
      console.log(err.response.data);
    }
  }

  const search = async (value) => {
    setQuery(value??null);

    if (!value.trim()) {
      setAllUsers([]);
      return;
    }

    try {
      const res = await api.get(
        `/user/search?query=${encodeURIComponent(value)}`
      );

      setAllUsers(res.data.users);

    } catch (err) {
      console.log(err.response.data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="w-105 bg-zinc-950 rounded-2xl">

        {/* Header */}
        <div className="flex justify-between p-4 border-b border-zinc-800 text-white">
          <h2>Find People</h2>

          <button onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="flex items-center gap-2 bg-zinc-900 rounded-full px-4 py-3">

            <Search size={16} />

            <input
              value={query}
              onChange={(e) => search(e.target.value)}
              placeholder="Search by name"
              className="flex-1 bg-transparent outline-none text-white"
            />

          </div>
        </div>

        {/* Results */}
        <div className="px-4 pb-4">

          {allUsers.map((user) => (

            <div
              key={user._id}
              className="flex items-center gap-3 p-3"
            >

              <img
                src={user.profilePic}
                className="w-11 h-11 rounded-full"
              />

              <div className="flex-1">
                <p className="text-sm text-zinc-500">{user.name}</p>
                <p className="text-sm text-zinc-500">
                  {user.email}
                </p>
              </div>

              <button
                className="bg-indigo-500 p-2 rounded-full"
                onClick={() => {
                 sendfrndrqst(user._id);
                }}
              >
                <UserPlus size={16} />
              </button>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}