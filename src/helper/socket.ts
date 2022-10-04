"use strict"


import http from 'http'
import { isObjectIdOrHexString } from 'mongoose';
import Filter from 'bad-words'

import { genrateMessage ,genratelocationMessage} from '../common';
import { removeUser,addUser,getUser,getUserRoom } from '../database/models/user';





export const socketServer = (app)=>{

    let server = new http.Server(app);
    const io    =require('socket.io')(server);
    ioevents(io);
    // console.log(io);
    
    return server;
}

let count = 0
 export const ioevents=(io)=>{
    io.on('connection',(socket)=>{
        console.log("websocket connection");

        socket.on('join',(options,callback)=>{
            const {error,user}= addUser({id:socket.id,...options});

            // console.log(user.room);
            
          
            if(error){
                return callback(error)
            }
            socket.join(user.room)

            socket.emit('message',genrateMessage('welcome!',user.username))
            socket.broadcast.to(user.room).emit('message',genrateMessage(`${user.username} has joined`,user.username))
            io.to(user.room).emit('roomData',{
                users:getUserRoom(user.room),
                room:user.room
            })
          
            
            
            
            callback();
        })
        socket.on('sendmessage',(message, callback)=>{
            const user= getUser(socket.id)
            const filter= new Filter();
            if(filter.isProfane(message)){  
                          
            return callback('****')           
                          
            }
            
            io.to(user.room).emit('message',genrateMessage(message,user.username));
            callback()
           
        })
       

        socket.on('disconnect',()=>{
            const user= removeUser(socket.id)
            if(user){

                
                io.to(user.room).emit('message',genrateMessage(` ${user.username} disconnected`,user.username))
                io.to(user.room).emit('roomData',{
                    users:getUserRoom(user.room),
                    room:user.room
                })
            }

        })
        socket.emit('countUpdated',count)
        socket.on('increment',  ()=>{
           count++
           io.emit("countUpdated",count)
           })
        socket.on('sendlocation', (coords,callback) => {
            const user= getUser(socket.id);
           
            io.to(user.room).emit('location_message',genratelocationMessage( `http://google.com/maps?=${coords.latitude},${coords.longitude}`,user.username))
            callback();
            })



        //     socket.on('isTyping', data => {
        //         console.log("data",data);
        //         let msg = data
        //         io.emit('Typing', msg);
        //         console.log('message',msg);
                
        //       })
        })
        
   

   
}






