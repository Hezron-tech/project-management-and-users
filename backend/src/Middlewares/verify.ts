import { VerifyData, User } from './../Interface/interfaces';
import  jwt  from 'jsonwebtoken';
import dotenv from 'dotenv'
import { NextFunction, Request, Response } from 'express'

dotenv.config()

interface Extended extends Request{
    info?:VerifyData

}

export const VerifyToken =(req:Extended,res:Response, next:NextFunction)=>{

    try {
        
        const token =req.headers['token'] as string

        if(!token){
            return res.json({message:"not allowed to to login:provide token"});
            
            
        }

        const data = jwt.verify(token,process.env.KEY as string) as VerifyData
       req.info=data
    } catch (error) {
        res.json({error})
        
    }
    next()

}