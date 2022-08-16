
//import { checkUser } from './users';
//import { VerifyData } from './../Interface/interfaces';
import { RequestHandler,Request,Response } from 'express';
import mssql from 'mssql';
import { sqlConfig } from '../Config/config';
import {v4 as uid} from 'uuid';
import bcrypt from 'bcrypt'
import { UserSchema, UserSchemas } from '../Helpers/validator';
import { User,VerifyData } from '../Interface/interfaces';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
interface Extended extends Request{
  info?:VerifyData

}

export const registerUser: RequestHandler = async (req, res) => {
    try {
      const user_id = uid();
      const { username, email,password } = req.body as { username: string; email: string; password:string};

      const {error,value}= UserSchema.validate(req.body)
      if(error){
        return res.json({error:error.details[0].message})

      }
      const pool = await mssql.connect(sqlConfig);
      const hashedpassword = await bcrypt.hash(password,10)

      
      await pool
      .request()
      .input("user_id",mssql.VarChar,user_id)
      .input("username", mssql.VarChar,username)
      .input("email",mssql.VarChar,email)
      .input("password", mssql.VarChar,hashedpassword)
      .execute('insertUsers')

      
  
      // console.log(req.body);
  
      res.json({ message: "succesfully inserted" });
    } catch (error) {
      res.json({ error });
    }
  };





  export const loginUser:RequestHandler =async (req,res)=>{
    try {

      const {email,password}=req.body
      const pool = await mssql.connect(sqlConfig)
      const {error,value}= UserSchemas.validate(req.body)
      if(error){
        return res.json({error:error.details[0].message})

      }

      const user:User[] = await (await pool .request()
      .input ('email',mssql.VarChar,email) 
      .execute('getUser')).recordset

      if(!user){
        return res.json({message:"user not found"})
      }

      const validPassword = await  bcrypt.compare(password,user[0].password)
      if(!validPassword){
        return res.json({message:'invalid password'})
      }
      const payload = user.map(item=>{
        const{password, ...rest} =item
        return rest
      })

      

      const token = jwt.sign(payload[0],process.env.KEY as string,{expiresIn:'3600s'})
      res.json(
        {message:'successfully login',
        token})
    } catch (error) {

      
     res.json({error}) 
    }

  }


  export const getUsers:RequestHandler=async(req,res) =>{
    try {
      const pool= await mssql.connect(sqlConfig)
      const users= await pool.request().execute('getUsers')
      const {recordset}=users
      res.json(recordset)
      
    } catch (error) {
      res.json({error})
    }
  }
   
  export const checkUser= async (req:Extended, res:Response)=>{

    if(req.info){
  
      res.json({name:req.info.username, role:req.info.Role})
  
    }
  
  }

  export const Home=async(req:Extended, res:Response)=>{
    if(req.info){
    return res.json({message:`welcome to homepage ${req.info.username}`})

  }
  }