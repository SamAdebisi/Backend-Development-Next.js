import express from "express";
import { addToWatchlist } from "../controllers/watchlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware); // Apply the auth middleware to all routes in this router

router.post("/", addToWatchlist);

// router.delete("/:id", removeFromWatchlist);

export default router;
