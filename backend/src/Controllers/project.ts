import { Request, Response, RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import { sqlConfig } from "../Config/config";
import mssql from "mssql";
import dotenv from "dotenv";
dotenv.config();

// interface ExtendedRequest extends Request{
//     body:{
//         name:string
//         description: string
//     }

// }

export const createProject = async (req: Request, res: Response) => {
  try {
    const id = uuidv4();

    const { name, description, date, user_id } = req.body as {
      name: string;
      description: string;
      date: string;
      user_id: string;
    };

    //check if kuna project with user_id=user_id
    //if yes return error
    const pool = await mssql.connect(sqlConfig);

    const project = await pool
      .request()
      .input("user_id", mssql.VarChar, user_id)
      .execute("getProject");

    const { recordset } = project;
    if (recordset[0]) {
      return res.json({
        message: "User already has a project assigned",
        success: false,
      });
    }

    console.log(name, description, date);
    await pool
      .request()
      .input("id", mssql.VarChar, id)
      .input("name", mssql.VarChar, name)
      .input("description", mssql.VarChar, description)
      .input("date", mssql.VarChar, date)
      .input("user_id", mssql.VarChar, user_id)
      .execute("insertProject");

    res.json({ message: "project created  successfully" });
  } catch (error: any) {
    res.json({ error });
  }
};

export const getProjects: RequestHandler = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const project = await pool.request().execute("allProjects");
    const { recordset } = project;
    res.json(recordset);
  } catch (error) {
    res.json({ error });
  }
};

export const getProject: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const id = req.params.id;
    const pool = await mssql.connect(sqlConfig);
    const project = await pool
      .request()
      .input("user_id", mssql.VarChar, id)
      .execute("getProject");
    const { recordset } = project;
    if (!project.recordset[0]) {
      res.json({ message: "Project Not Found" });
    } else {
      res.json(recordset);
    }
  } catch (error) {
    res.json({ error });
  }
};

export const updateProject: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  try {
    const id = req.params.id;
    const pool = await mssql.connect(sqlConfig);
    const { name, description, date } = req.body as {
      name: string;
      description: string;
      date: string;
    };
    const project = await pool
      .request()
      .input("id", mssql.VarChar, id)
      .execute("singleProject");

    if (!project.recordset[0]) {
      res.json({ message: "product not found" });
    } else {
      await pool
        .request()
        .input("id", mssql.VarChar, id)
        .input("name", mssql.VarChar, name)
        .input("description", mssql.VarChar, description)
        .input("date", mssql.VarChar, date)
        .execute("updateProject");

      res.json({ message: "project updated" });
    }
  } catch (error) {
    res.json({ error });
  }
};

export const deleteProject: RequestHandler<{ id: string }> = async (
  req,
  res
) => {
  try {
    const id = req.params.id;
    const pool = await mssql.connect(sqlConfig);

    const project = await pool
      .request()
      .input("id", mssql.VarChar, id)
      .execute("singleProject");
    if (!project.recordset[0]) {
      res.json({ message: "Project Not Found" });
    } else {
      await pool
        .request()
        .input("id", mssql.VarChar, id)
        .execute("deleteProject");
      res.json({ message: "Project Deleted" });
    }
  } catch (error: any) {
    res.json({ error });
  }
};
