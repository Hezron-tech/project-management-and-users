import ejs from 'ejs'
import mssql from 'mssql'
import dotenv from 'dotenv'
import {sqlConfig} from '../Config/config'
import sendMail from '../Helpers/email'

dotenv.config()
interface Role{
    user_id:string
    username:string
    email:string
    password:string
    Role:string
    assigned:string
}


const SendEmails= async()=>{
const pool = await mssql.connect(sqlConfig)
const Roles:Role[]= await(await pool.request().query(`
SELECT * FROM users WHERE assigned='0'`)).recordset

 for(let Role of Roles){

    ejs.renderFile('templates/registration.ejs',{username:Role.username,Role:Role.Role} ,async(error,data)=>{

        let messageoption={
            from:process.env.EMAIL,
            to:Role.email,
            subject:" account registration",
            html:data,
            attachments:[
                {
                    fileusername:'Role.txt',
                    
                }
            ]
        }

        try {
            
            await sendMail(messageoption)
            await pool.request().query(`UPDATE users SET assigned='1' WHERE user_id = '${Role.user_id}'`)
            console.log('Email is Sent');
            
        } catch (error) {
            console.log(error);
            
        }


    })

 }


}

export default SendEmails