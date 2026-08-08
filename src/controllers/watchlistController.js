import { prisma } from "../config/db.js";

const addToWatchlist = async (req, res) => {
  const { movieId, status = "PLANNED", rating, notes } = req.body ?? {};

  if (!movieId) {
    return res.status(400).json({
      error:
        "movieId is required. Send the request body as JSON with Content-Type: application/json",
    });
  }

  // Verify movies exists
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  // Check if the movie is already in the user's watchlist
  const existingInWatchlist = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: {
        userId: req.user.id,
        movieId,
      },
    },
  });

  if (existingInWatchlist) {
    return res.status(400).json({ error: "Movie already in the watchlist" });
  }
  const watchlistItem = await prisma.watchlistItem.create({
    data: {
      userId: req.user.id,
      movieId,
      status,
      rating,
      notes,
    },
  });

  res.status(201).json({
    status: "success",
    data: {
      watchlistItem,
    },
  });
};
export { addToWatchlist };
