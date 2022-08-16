import express,{json} from 'express'
import cron from 'node-cron'
import SendEmails from './EmailService/service';
import SendEmail from './EmailService/project';
const app = express()
const run =()=>{
  cron.schedule('*/60 * * * * *', async() => {
    console.log('running a  minute');
    await SendEmails()
    await SendEmail()
  })
  }
  run()

app.use(json())

//app.use('/', route)

app.listen(6000,()=>{
    console.log("server is running at port 6000");
    
})