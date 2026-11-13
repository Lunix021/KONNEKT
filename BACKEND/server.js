const express=require('express');

const cors=require('cors');

const http=require('http');

const {Server}=require("socket.io");

const userRouter=require('./routes/user');

const friendRouter=require('./routes/friend');

const chatRouter=require('./routes/chat');

const messageRouter=require('./routes/message');

const reelRouter=require('./routes/reel');

const app=express();

const dbcon=require('./dbcon');

const cookieParser = require('cookie-parser');

const port=5051;

const server=http.createServer(app);


const io=new Server(server,{cors:{
    origin:"http://localhost:5173",
    credentials:true
}});

app.use(express.json());

dbcon();

app.use(cookieParser());



app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

app.use('/user',userRouter);

app.use("/friend", friendRouter);

app.use("/chat", chatRouter);

app.use("/message", messageRouter);

app.use("/reel",reelRouter);

app.set("io",io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinroom",(data)=>{
    socket.join(data);
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


server.listen(port,()=>{
    console.log(`Server is running at https://localhost:${port}`)
});

