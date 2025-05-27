import { Router } from 'express';
import {
  createPost,
  updatePost,
  getAllPosts,
  showPost,
  deletePost,
  searchPost 
} from "../Controller/PostController.js";

const router = Router();

router.post("/", createPost);
router.put("/:id", updatePost);
router.get("/", getAllPosts);
router.get("/search", searchPost); 
router.get("/:id", showPost);
router.delete("/:id", deletePost);


export default router;
