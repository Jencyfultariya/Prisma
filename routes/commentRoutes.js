import { Router } from 'express';
import { createComment, deleteComment, showComment, updateComment, getAllComment } from '../Controller/CommentController.js';

const router = Router();

router.post("/", createComment);
router.get("/", getAllComment);
router.get("/:id", showComment);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;
