import express, { type Request } from "express";
import type { DBService } from "../interfaces/DBService.ts";

export function createThemesRouter(dbService: DBService) {
  const router = express.Router();

  // Debug endpoint to test theme functionality
  router.get("/api/themes/debug", async (req: Request, res) => {
    const userId = (req as any).session.userId;

    try {
      console.log("Theme Debug - User ID:", userId);

      if (!userId) {
        return res.json({
          error: "No authenticated user session",
          sessionValid: false,
          needsLogin: true,
        });
      }

      const userThemes = await dbService.getThemesByUser(userId);

      res.json({
        sessionValid: true,
        userId: userId,
        themeCount: userThemes.length,
        themes: userThemes,
        message: "Theme debug successful",
      });
    } catch (error: any) {
      console.error("Theme debug error:", error);
      res.status(500).json({
        error: "Theme debug failed",
        details: error.message,
        needsTableCreation: error.message.includes(
          'relation "theme_schema" does not exist'
        ),
      });
    }
  });

  // Get all themes for current user
  router.get("/api/themes", async (req: Request, res) => {
    const userId = (req as any).session.userId;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    try {
      const userThemes = await dbService.getThemesByUser(userId);
      res.json({ themes: userThemes });
    } catch (error) {
      console.error("Error fetching themes:", error);
      res.status(500).json({ error: "Failed to fetch themes" });
    }
  });

  // Get specific theme by ID
  router.get("/api/themes/:themeId", async (req: Request, res) => {
    const { themeId } = req.params;

    try {
      const theme = await dbService.getThemeById(themeId as string);
      if (!theme) {
        return res.status(404).json({ error: "Theme not found" });
      }
      res.json({ theme });
    } catch (error) {
      console.error("Error fetching theme:", error);
      res.status(500).json({ error: "Failed to fetch theme" });
    }
  });

  // Create a new custom theme
  router.post("/api/themes", async (req: Request, res) => {
    const userId = (req as any).session.userId;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { theme_id, theme_desc, schema_str } = req.body;

    if (!theme_id || !schema_str) {
      return res.status(400).json({
        error: "Missing required fields: theme_id and schema_str are required",
      });
    }

    try {
      const newTheme = await dbService.createTheme({
        theme_id,
        theme_desc: theme_desc || undefined,
        schema_str,
        created_by: userId as string,
      });

      res.status(201).json({
        message: "Theme created successfully",
        theme: newTheme,
      });
    } catch (error: any) {
      console.error("Error creating theme:", error);

      if (error.message.includes("already exists")) {
        return res.status(409).json({ error: error.message });
      }

      res.status(500).json({ error: "Failed to create theme" });
    }
  });

  // Update an existing theme
  router.put("/api/themes/:themeId", async (req: Request, res) => {
    const userId = (req as any).session.userId;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { themeId } = req.params;
    const { theme_desc, schema_str } = req.body;

    if (theme_desc === undefined && schema_str === undefined) {
      return res.status(400).json({
        error: "At least one field (theme_desc or schema_str) must be provided",
      });
    }

    try {
      const updates: any = {};
      if (theme_desc !== undefined) updates.theme_desc = theme_desc;
      if (schema_str !== undefined) updates.schema_str = schema_str;

      const updatedTheme = await dbService.updateTheme(themeId as string, userId as string, updates);

      if (!updatedTheme) {
        return res
          .status(404)
          .json({ error: "Theme not found or access denied" });
      }

      res.json({ message: "Theme updated successfully", theme: updatedTheme });
    } catch (error: any) {
      console.error("Error updating theme:", error);

      if (error.message.includes("permission")) {
        return res.status(403).json({ error: error.message });
      }

      res.status(500).json({ error: "Failed to update theme" });
    }
  });

  // Delete a theme
  router.delete("/api/themes/:themeId", async (req: Request, res) => {
    const userId = (req as any).session.userId;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { themeId } = req.params;

    try {
      const deleted = await dbService.deleteTheme(themeId as string, userId as string);

      if (!deleted) {
        return res
          .status(404)
          .json({ error: "Theme not found or access denied" });
      }

      res.json({ message: "Theme deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting theme:", error);

      if (error.message.includes("permission")) {
        return res.status(403).json({ error: error.message });
      }

      res.status(500).json({ error: "Failed to delete theme" });
    }
  });

  // Check if user owns a theme
  router.get("/api/themes/:themeId/ownership", async (req: Request, res) => {
    const userId = (req as any).session.userId;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { themeId } = req.params;

    try {
      const isOwner = await dbService.isThemeOwner(themeId as string, userId as string);
      res.json({ isOwner });
    } catch (error) {
      console.error("Error checking theme ownership:", error);
      res.status(500).json({ error: "Failed to check ownership" });
    }
  });

  return router;
}


