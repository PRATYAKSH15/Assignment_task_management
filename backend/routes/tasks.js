import express from "express";
import { protect } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { createTaskSchema, updateTaskSchema } from "../validators/task.js";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.use(protect);

router.get("/", getTasks);
router.post("/", validateBody(createTaskSchema), createTask);
router.put("/:id", validateBody(updateTaskSchema), updateTask);
router.delete("/:id", deleteTask);

export default router;
