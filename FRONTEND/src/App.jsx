import { useEffect, useState } from 'react'
import './App.css'
import { Routes,Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Chat from './pages/Chat'
import api from '../api/axios'
import Reel from './pages/Reel'
import MainLayout from './layout/Mainlayout'
import Profile from './pages/Profile'
import Chatroom from './components/chat/Chatroom'
import { set } from 'zod'
Profile

function App() {

  const [user,setUser]=useState(undefined);

  useEffect(() => {
  const checkUser = async () => {
    try {
      const res = await api.get('/user/me');
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    }
  };

  checkUser();
}, []);

if (user === undefined) {
  return <h1>Loading...</h1>;
}

  return (
    <>
     <Routes>
    {user ? (

      <Route element={<MainLayout/>}>

        <Route path="/chats" element={<Chat user={user} setUser={setUser}/>} />
        <Route path="/reels" element={<Reel/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path='/chatroom/:chatId' element={<Chatroom/>}/>
     </Route>
      
      
    ) : (
      <>
        <Route path="/" element={<Login setUser={setUser}/>} />
        <Route path="/register" element={<Register />} />
      </>
    )}
  </Routes>
  
    </>
  )
}

export default App
