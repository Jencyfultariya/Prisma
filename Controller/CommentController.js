import prisma from '../DB/db.config.js';


export const createComment = async (req, res) => {
  try {
    const { user_id, post_id, comment } = req.body;

    // 1. Create the comment
    const newComment = await prisma.comment.create({
      data: {
        user_id: Number(user_id),
        post_id: Number(post_id),
        comment: comment,
      },
    });

    // 2. Increment comment count of the post
    await prisma.post.update({
      where: {
        id: Number(post_id),
      },
      data: {
        comment_count: {
          increment: 1,
        },
      },
    });

    return res.status(201).json({
      status: 201,
      msg: "Comment created successfully",
      data: newComment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({
      status: 500,
      msg: "Internal Server Error",
    });
  }
};


// Get all comments
export const getAllComment = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany(
      {
        include:{
        post:{
          include:{
            user:true,

          }
        }
        }
      }
    );
    return res.json({ status: 200, data: comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
};

// Get a single comment by ID
export const showComment = async (req, res) => {
  try {
    const commentId = Number(req.params.id);

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    return res.status(200).json({ status: 200, data: comment });
  } catch (error) {
    console.error("Error showing comment:", error);
    return res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
};

// Update a comment
export const updateComment = async (req, res) => {
  try {
    const commentId = Number(req.params.id);

    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: req.body,
    });

    return res.json({ status: 200, msg: "Comment updated successfully", data: updatedComment });
  } catch (error) {
    console.error("Error updating comment:", error);
    return res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
};

// Delete a comment and decrement comment count
export const deleteComment = async (req, res) => {
  try {
    const commentId = Number(req.params.id);

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    // Decrement comment count from the related post
    await prisma.post.update({
      where: { id: comment.post_id },
      data: {
        comment_count: {
          decrement: 1,
        },
      },
    });

    // Delete the comment
    await prisma.comment.delete({
      where: { id: commentId },
    });

    return res.json({ status: 200, msg: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
};
