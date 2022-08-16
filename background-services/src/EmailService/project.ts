import ejs from "ejs";
import mssql from "mssql";
import dotenv from "dotenv";
import { sqlConfig } from "../Config/config";
import sendMail from "../Helpers/email";

dotenv.config();
interface project {
  name: string;
  description: string;
  date: string;
  user_id: string;
  issent: string;
}

const SendEmail = async () => {
  const pool = await mssql.connect(sqlConfig);
  const projects: project[] = await (
    await pool.request().query(`
SELECT * FROM project WHERE issent='0'`)
  ).recordset;

  console.log(projects);
  

  for (let project of projects) {
    let result = await pool
      .request()
      .input("userId", project.user_id)
      .execute(`getAssignedEmails`);
    let emailRes = result.recordset[0];

    console.log("ghghgh", emailRes);

    if(emailRes){
      ejs.renderFile(
        "templates/assign_project.ejs",
        {
          username: emailRes.username,
          name: project.name,
          project: project.description,
        },
        async (error, data) => {
          if(error){
            console.log(error);
            return
            
          }
          let messageoption = {
            from: process.env.EMAIL,
            to: emailRes.email,
            subject: " task",
            html: data,
            attachments: [
              {
                fileusername: "project.txt",
              },
            ],
          };

          try {
            await sendMail(messageoption);
            await pool
              .request()
              .query(
                `UPDATE project SET issent='1' WHERE user_id = '${project.user_id}'`
              );
            console.log("Email is Sent");
          } catch (error) {
            console.log(error);
          }
        }
      );
    }
  }
};

export default SendEmail;
