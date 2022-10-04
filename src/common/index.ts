
export const apiResponse = async (status, message, data, error) => {
    return {
        status,
        message,
        data: await (data),
        error: Object.keys(error)?.length == 0 ? {} : await (error)
    }
}

export const userStatus = {
    user: "user",
    admin: "admin",
    upload: "upload"
}


 export const genrateMessage= (text,username)=>{

   return {
       text,
         username,
        createdAt:new Date().getTime()
    }
}
 export const genratelocationMessage= (url,username)=>{

   return {
        url,
        username,
        createdAt:new Date().getTime()
    }
}