import React from 'react'
import Body from '../components/chat/Body'
import Header from '../components/chat/Header'


function Chat({user,setUser}) {
  return (
    <div className='bg-zinc-950 min-h-screen '>

<Header setUser={setUser}/>
<Body user={user}/>
        
    </div>
  )
}

export default Chat