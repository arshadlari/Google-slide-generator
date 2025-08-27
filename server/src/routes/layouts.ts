import express from "express";
import type { DBService } from "../interfaces/DBService.ts";
import { createUniqueSlideFromLayoutData } from "../models/slides/layoutLoader.ts";

export function createLayoutsRouter(dbService: DBService) {
  const router = express.Router();

  // Fetch a layout by id from Neon and return Slide batch requests
  router.get("/api/layouts/:layoutId/batchRequests", async (req, res) => {
    const { layoutId } = req.params;

    try {
      const layout = await dbService.getLayoutById(layoutId);
      if (!layout) {
        return res.status(404).json({ error: "Layout not found" });
      }

      const slide = createUniqueSlideFromLayoutData(layout.data);
      const batchRequests = slide.toBatchRequests();

      return res.json({ id: layout.id, name: layout.name, batchRequests });
    } catch (error) {
      console.error("Error fetching layout:", error);
      return res.status(500).json({ error: "Failed to fetch layout" });
    }
  });

  // id-name map
  router.get("/api/layouts-id-name", async (_req, res) => {
    try {
      const layout = await (dbService as any).getAllLayoutsIdAndName();
      if (!layout) {
        return res.status(404).json({ error: "Layout not found" });
      }
      return res.json({ layout });
    } catch (error) {
      console.error("Error fetching layout:", error);
      return res.status(500).json({ error: "Failed to fetch layout" });
    }
  });

  // Get all layouts (id and name only)
  router.get("/api/layouts", async (req, res) => {
    try {
      console.log("fetching layouts in backend");
      const layouts = await dbService.getAllLayouts();
      return res.json({
        layouts: layouts,
      });
    } catch (error) {
      console.error("Error fetching layouts:", error);
      return res.status(500).json({ error: "Failed to fetch layouts" });
    }
  });
  return router;
}


