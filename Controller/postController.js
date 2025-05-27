import prisma from '../DB/db.config.js';

// ✅ Create a Post
export const createPost = async (req, res) => {
  try {
    const { user_id, title, description } = req.body;

    const newPost = await prisma.post.create({
      data: {
        user_id: Number(user_id),
        title,
        description,
      },
    });

    return res.status(201).json({ status: 201, msg: "Post created successfully", data: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
};

// ✅ Get All Posts with Comments and Pagination
export const getAllPosts = async (req, res) => {
  try {
    // 1. Get query params for page and limit
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;

    // 2. Sanitize values
    if (page < 1) page = 1;
    if (limit < 1 || limit > 100) limit = 10;

    const skip = (page - 1) * limit;

    // 3. Filter for posts that match comment_count > 1
    const filter = {
      comment_count: {
        gt: 1,
      },
    };

    // 4. Count only the posts that match the filter
    const totalPosts = await prisma.post.count({
      where: filter,
    });

    // 5. Calculate total pages based on filtered posts and limit
    const totalPages = Math.ceil(totalPosts / limit);

    // 6. Fetch posts with pagination and filters
    const posts = await prisma.post.findMany({
      where: filter,
      skip,
      take: limit,
      include: {
        comment: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // 7. Send response with correct pagination meta
    return res.json({
      status: 200,
      data: posts,
      meta: {
        totalPosts,      // Total matching posts
        totalPages,      // Correct total pages
        currentPage: page,
        limit,
      },
    });

  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
};


// ✅ Get a Single Post
export const showPost = async (req, res) => {
  try {
    const postId = Number(req.params.id);

    const post = await prisma.post.findFirst({
      where: {
        id: postId,
      },
      include: {
        comment: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ status: 404, msg: "Post not found" });
    }

    return res.json({ status: 200, data: post });
  } catch (error) {
    console.error("Error showing post:", error);
    return res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
};

// ✅ Update a Post
export const updatePost = async (req, res) => {
  try {
    const postId = Number(req.params.id);

    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: req.body,
    });

    return res.json({ status: 200, msg: "Post updated successfully", data: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
};

// ✅ Delete a Post
export const deletePost = async (req, res) => {
  try {
    const postId = Number(req.params.id);

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    return res.json({ status: 200, msg: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
};

// ✅ Search Posts by Description
export const searchPost = async (req, res) => {
  try {
    const query = req.query.q;

    const posts = await prisma.post.findMany({
      where: {
        description: {
          contains: query,
          mode: 'insensitive', // Optional: makes the search case-insensitive
        },
      },
    });

    return res.json({ status: 200, data: posts });
  } catch (error) {
    console.error("Error searching posts:", error);
    return res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
};
