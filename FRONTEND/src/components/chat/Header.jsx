import React, { useRef } from 'react'
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import api from '../../../api/axios';
import { useNavigate } from 'react-router-dom';
function Header({setUser}) {

const navigate=useNavigate();
const videoref=useRef("");
 const formData=new FormData();


const handlevideo=async (e)=>{
const file=e.target.files[0];
formData.append("video",file);
const res=await api.post('/reel/add',formData);
console.log(res.data);

}



//logout 
  const logout=async()=>{
    try {
      const res=await api.post('/user/logout');
      console.log(res.data);
     setUser(null);
     navigate('/');

    } catch (err) {
          console.log("LOGOUT ERROR:", err);
    console.log("SERVER RESPONSE:", err.response.data);
    }
  }

  return (
    <div className="flex items-center justify-between px-6 pt-7 pb-4">
          <h1 className="text-white text-2xl font-extrabold tracking-tight cursor-pointer" onClick={logout}>
            KONNEKT<span className="text-indigo-500">.</span>
          </h1>
          
           
            <motion.button
              whileTap={{ scale: 0.85 }}
              className="w-8 h-8 rounded-full border border-white/80 flex items-center justify-center text-white"
              aria-label="New chat"
            >
              <Plus size={18} strokeWidth={2.5} onClick={()=>{videoref.current.click()}} />
              
              <input ref={videoref} type="file" accept='video/*' className='hidden' onChange={handlevideo}/>

            </motion.button>
         
        </div>
  )
}

export default Header