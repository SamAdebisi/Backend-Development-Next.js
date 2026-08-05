import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userExists) {
    return res
      .status(400)
      .json({ error: "User already exists with this email" });
  }

  // Hash the password before storing it in the database
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: name,
        email: email,
      },
    },
  });
};

export { register };
