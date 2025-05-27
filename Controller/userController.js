import { title } from 'process';
import prisma from '../DB/db.config.js';
export const fetchUser = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where:{
        name:{
          startsWith:"jency",
        },
      },k
     
    });
    return res.json({ status: 200, data: users });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
  
};


export const createUser = async (req, res) => {
  try {
    const { name:name, email:email } = req.body;

    // Check if user exists
    const findUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (findUser) {
      return res.status(400).json({ message: 'Email already taken. Please use another email.' });
    }

    // Create user (note: you're not storing password here, consider adding it if needed)
    const newUser = await prisma.user.create({
      data: { name, email }
    });

    return res.status(201).json(newUser);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        name,
        email,
      },
    });

    return res.json({ status: 200, data: updatedUser, msg: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ status: 500, msg: error.message });
  }
};
export const showUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await prisma.user.findFirst({
      where: {
        id: Number(userId),
      },
    });

    return res.json({ status: 200, data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ status: 400, msg: "Invalid user ID" });
    }

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return res.json({ status: 200, msg: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);

    // Prisma error for record not found
    if (error.code === 'P2025') {
      return res.status(404).json({ status: 404, msg: "User not found" });
    }

    return res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
};







