import express from "express";
import dotenv from "dotenv";
import session from "express-session";

import cors from "cors";
import type { DBService } from "./interfaces/DBService.ts";
import { NeonDBService } from "./services/NeonDBService.ts";
import type { GoogleAuthService } from "./interfaces/GoogleAuthService.ts";
import { GoogleAuthServiceImpl } from "./services/GoogleAuthServiceImpl.ts";
import { MongoDBClient } from "./services/MongoDBClient.ts";
import { createAuthRouter } from "./routes/auth.ts";
import { createThemesRouter } from "./routes/themes.ts";
import { createLayoutsRouter } from "./routes/layouts.ts";
import { createPresentationsRouter } from "./routes/presentations.ts";
import { createContentModelsRouter } from "./routes/contentModels.ts";

dotenv.config();
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", // Allow your frontend origin
    credentials: true, // If sending cookies or Authorization header
  })
);

const mongoClient = MongoDBClient.getInstance(process.env.MONGO_URI!);
const dbService: DBService = NeonDBService.getInstance(
  process.env.DATABASE_URL!
);  
const googleService: GoogleAuthService = new GoogleAuthServiceImpl(dbService);

// 🔐 Use sessions to store userId
app.use(
  session({
    secret: "your-secret-key", // change this in production
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: false, // Set to true in production with HTTPS
    },
  })
);

// Mount routers
app.use(createAuthRouter(googleService, dbService));
app.use(createThemesRouter(dbService));
app.use(createPresentationsRouter(googleService, dbService));
app.use(createLayoutsRouter(dbService));
app.use(createContentModelsRouter());


app.get("/ppt/get", async (req, res) => {
  res.json(await mongoClient.getAllPpt());
});

app.post("/ppt/update", async (req, res) => {
  const json = req.body;
  const userId = (req as any).session.userId;

  // Get user information if available
  let userInfo = null;
  if (userId) {
    try {
      userInfo = await dbService.getUserToken(userId as string);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }

  await mongoClient
    .saveDeck(json.pptJson, json.slidesArr, json.themes, userInfo)
    .then(() => {
      res
        .status(200)
        .json({ success: true, message: "Deck saved successfully" });
    })
    .catch((err) => {
      console.error("❌ Server: Error saving deck:", err);
      res.status(500).json({ success: false, message: "Failed to save deck" });
    });
});

app.post("/slide/delete", async (req, res) => {
  const json = req.body;
  const userId = (req as any).session.userId;
  // check if user is valid
  const userInfo = await dbService.getUserToken(userId as string);
  if (!userInfo) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  await mongoClient.deleteSlide(json.presentationId, json.slideId);
  res.json({ success: true, message: "Slide deleted successfully" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


