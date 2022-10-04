

const users= []


export const addUser= ({id,username,room})=>{
    //clean the data
    username=username
    room = room
    //validation the data
    if(!username || !room){
        return{

            error:'username and room are are required!'
        }
    }
    
    
    //check for exsiting user
    
    const exisitingUser= users.find((user)=>{
        return user.room === room && user.username === username
    })

    if(exisitingUser){
        return{
            error:'Username is in use!'
        }
    }


    //Store user

    const user= {id,username,room}
    users.push(user)
    return {user}
}


 export const removeUser= (id)=>{
    const index=users.findIndex((user)=> user.id === id)
    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

 export const getUser=(id)=>{
    return users.find((user)=>user.id===id)
}

 export const getUserRoom= (room)=>{
        
    return users.filter((user)=>user.room===room)
}



// console.log((users));
