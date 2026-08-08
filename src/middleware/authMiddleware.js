import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

  // Read the token from the request and check if token is valid 

const authMiddleware = async (req, res, next) => {
  console.log("Auth Middleware reached");
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token provided" });
  }

  try {
    // verify the token and extract the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return res.status(401).json({ error: "Not authorized, user not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: "Authentication token is invalid or expired" });
  }
};

export { authMiddleware };



// const Protect = async (req, res, next) => {
//   const authorization = req.get("authorization");

//   if (!authorization?.startsWith("Bearer ")) {
//     return res.status(401).json({
//       error: "Authentication required. Send an Authorization: Bearer <token> header",
//     });
//   }

//   const token = authorization.slice("Bearer ".length).trim();

//   if (!token) {
//     return res.status(401).json({ error: "Authentication token is missing" });
//   }

//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await prisma.user.findUnique({
//       where: { id: payload.id },
//       select: { id: true, name: true, email: true },
//     });

//     if (!user) {
//       return res.status(401).json({ error: "Authentication token is invalid" });
//     }

//     req.user = user;
//     next();
//   } catch { 
//     return res
//       .status(401)
//       .json({ error: "Authentication token is invalid or expired" });
//   }
// };

// export { Protect };
