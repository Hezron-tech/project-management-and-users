import { VerifyToken } from "./../Middlewares/verify";
import { getProjects, getProject } from "../Controllers/project";
import {
  createProject,
  updateProject,
  deleteProject,
} from "../Controllers/project";
import { Router } from "express";
import {
  registerUser,
  loginUser,
  Home,
  getUsers,
  checkUser,
} from "../Controllers/users";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/homepage", VerifyToken, Home);
router.get("/getUsers", getUsers);
router.post("/log out");
router.get("/checkuser", VerifyToken, checkUser);

//project

router.post("/create", createProject);
router.get("/all", getProjects);
router.get("/:id", getProject);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
