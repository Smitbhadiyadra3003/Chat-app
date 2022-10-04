




 const socket =io();



 const $chatbox=document.querySelector('#message-form')
 const $sendlocation=document.querySelector('#send-location');
 const $messagebox=$chatbox.querySelector('#message')
 const $sendmessage=$chatbox.querySelector('button')
 const $messages= document.querySelector('#messages');
 const $Join= document.querySelector('#join_button');



 //Templets

 const message_templete=document.querySelector('#message-template').innerHTML
 const location_message_templete=document.querySelector('#location-message-template').innerHTML
const  sidebar_templete= document.querySelector('#sidebar-template').innerHTML


 //Options
 const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


 const autoscroll =()=>{
    //New message element

const $newmessage=$messages.lastElementChild

//Height of the new message
const newMessagestyle = getComputedStyle($newmessage);
const newMesssageMargin= parseInt(newMessagestyle.marginBottom)
const newMessageHeight= $newmessage.offsetHeight + newMesssageMargin

//visible height
const visibleHeight = $messages.offsetHeight

//Height if messges container

const containerHeight= $messages.scrollHeight


//how far have I scrolled?
scrollOffset= $messages.scrollTop + visibleHeight

console.log(containerHeight);

if(containerHeight- newMessageHeight <= scrollOffset){
    $messages.scrollTop= $messages.scrollHeight
}
}
//  socket.on('countUpdated',(count)=>{
//     console.log("the count has been updated",count)
//    })

socket.on('message',(message)=>{
    // console.log(message);
    const html= Mustache.render(message_templete,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    // console.log(message.text);
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('location_message',(url)=>{
    console.log(url)

    const html = Mustache.render(location_message_templete,{
        url:url.url,
        username:url.username,
        createdAt:moment(url.createdAt).format('h:mm a')
    })

    $messages.insertAdjacentHTML('beforebegin',html)
    autoscroll()
    
})



socket.on('roomData',({users,room})=>{
        const html =Mustache.render(sidebar_templete,{
        users,
         room
        })
        document.querySelector('#sidebar').innerHTML=html
        
})

//    document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('clicked')
//     socket.emit('increment')
//    })

   $chatbox.addEventListener('submit',(e)=>{

    e.preventDefault();
    $sendmessage.setAttribute('disabled','disabled')

    const message= e.target.elements.message.value

    socket.emit('sendmessage',message, (error)=>{
    $sendmessage.removeAttribute('disabled')
    $messagebox.value =''
    $messagebox.focus()

        if(error){
        return  console.log(error);
      }
      console.log('message deliverd',)
    })

   })

   $sendlocation.addEventListener('click',()=>{
    $sendlocation.setAttribute('disabled','disabled')
    if(!navigator.geolocation){
        return alert('geolocation not supported');
    }
    // console.log(navigator.geolocation);

    navigator.geolocation.getCurrentPosition((Position)=>{
        socket.emit('sendlocation',{
            latitude: Position.coords.latitude,
            longitude: Position.coords.longitude
        },( )=>{
            $sendlocation.removeAttribute('disabled')
            return console.log('location shared sucess');
        })
    })
   })


    socket.emit('join',{username,room},(error)=>{
   
        if (error) {
           alert("hello",error)
           location.href = '/'
       }
    })  




    // $messagebox.addEventListener('input', (e) => {
    //     let message = e.target.value
    //     socket.emit('isTyping', message)
    //     console.log(message);
    // })
    // socket.on('Typing', (data) => {
        
    //     const realTime= Mustache.render(message_templete,{
    //         data
    //     })       
    //     $messages.insertAdjacentHTML('beforeend',realTime)
    //     console.log("client", data);
    // })

