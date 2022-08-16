export interface User{
    user_id:string
    username:string
    email:string
    password:string
    Role:string
    assigned:string
}



export interface VerifyData{
    id:string
    Role:string
    username:string
    email: string
    iat:number
    exp:number
}