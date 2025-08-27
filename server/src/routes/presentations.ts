import express, { type Request } from "express";
import { google } from "googleapis";
import type { GoogleAuthService } from "../interfaces/GoogleAuthService.ts";
import { applyThemesToSlides } from "../themeUtils.ts";
import { createPresentation, createEmptyPresentation, deleteAllSlides, updatePresentationTitle } from "../slideGenerator.ts";
import type { DBService } from "../interfaces/DBService.ts";
import { createUniqueSlideFromLayoutData } from "../models/slides/layoutLoader.ts";

export function createPresentationsRouter(
  googleService: GoogleAuthService,
  dbService: DBService
) {
  const router = express.Router();

  router.post("/api/create-presentation", async (req: Request, res) => {
    const { presentationTitle } = req.body;

    const userId = (req as any).session.userId;
    const client = await googleService.getClientForUser(userId);
    const slidesApi = google.slides({ version: "v1", auth: client });

    try {
      const result = await createEmptyPresentation(slidesApi, presentationTitle);
      console.log("Empty presentation created:", result);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).send("failed to create new presentation");
    }
  });

  router.patch("/api/update-presentation-title", async (req: Request, res) => {
    const { presentationId, title } = req.body;

    const userId = (req as any).session.userId;
    const client = await googleService.getClientForUser(userId);

    try {
      const result = await updatePresentationTitle(client, presentationId, title);
      console.log("Presentation title updated:", result);
      res.json({ success: true, title: title });
    } catch (err) {
      console.error(err);
      res.status(500).send("failed to update presentation title");
    }
  });

  router.post("/presentation/create", async (req: Request, res) => {
    const userId = (req as any).session.userId;
    const { slides, presentationId, themes } = req.body;

    try {
      const client = await googleService.getClientForUser(userId);
      const slidesApi = google.slides({ version: "v1", auth: client });

      const themedSlides = applyThemesToSlides(slides, themes);

      const url = await createPresentation(slidesApi, themedSlides, presentationId);

      console.log("Generated ppt url: ", url);
      res.json({ url: url });
    } catch (error: any) {
      console.error("Presentation creation error:", error);

      if (error.message?.includes("re-authenticate with consent")) {
        return res.status(401).json({
          error: "Authentication required",
          needsConsent: true,
          message: "Please log in again to grant necessary permissions",
        });
      }

      res.status(500).json({ error: "Failed to create presentation" });
    }
  });

  router.post("/presentation/create/akqa", async (req: Request, res) => {
    const userId = (req as any).session.userId;
    const { slides, presentationId, themes } = req.body;

    try {
      const client = await googleService.getClientForUser(userId);
      const slidesApi = google.slides({ version: "v1", auth: client });

      const themedSlides = applyThemesToSlides(slides, themes);

      if (presentationId) {
        await deleteAllSlides(presentationId, slidesApi);
      }

      let requests: any[] = [];

      if (Array.isArray(slides) && slides.length > 0) {
        for (const s of slides) {
          if (!s?.slideId || !s?.layout) continue;
          try {
            const layout = await dbService.getLayoutById(String(s.layout));
            if (!layout) continue;

            const slideModel = createUniqueSlideFromLayoutData(layout.data, {
              slideIdOverride: String(s.slideId),
              inputs: s.inputs || {},
            });

            const elementRequests = slideModel.toBatchRequests();
            requests.push(
              { createSlide: { objectId: String(s.slideId) } },
              ...elementRequests,
            );
          } catch (e) {
            console.error("Failed to apply custom layout slide:", e);
          }
        }
      }

      if (requests.length > 0) {
        await slidesApi.presentations.batchUpdate({
          presentationId: presentationId as string,
          requestBody: { requests },
        });
      }

      const url = `https://docs.google.com/presentation/d/${presentationId as string}/edit`;

      console.log("Generated ppt url: ", url);
      res.json({ url: url });
    } catch (error: any) {
      console.error("Presentation creation error:", error);

      if (error.message?.includes("re-authenticate with consent")) {
        return res.status(401).json({
          error: "Authentication required",
          needsConsent: true,
          message: "Please log in again to grant necessary permissions",
        });
      }

      res.status(500).json({ error: "Failed to create presentation" });
    }
  });

  router.get("/google/get-slides", async (req: Request, res) => {
    const userId = (req as any).session.userId;

    try {
      const client = await googleService.getClientForUser(userId);
      const slidesApi = google.slides({ version: "v1", auth: client });
      const presentationId = req.body.presentationId;
      const res2 = await slidesApi.presentations.get({ presentationId: presentationId as string });

      res.json(res2);
    } catch (error: any) {
      console.error("Presentation creation error:", error);

      if (error.message?.includes("re-authenticate with consent")) {
        return res.status(401).json({
          error: "Authentication required",
          needsConsent: true,
          message: "Please log in again to grant necessary permissions",
        });
      }
    }
  });

  router.post("/test/createppt/batchrequests", async (req: Request, res) => {
    const userId = (req as any).session.userId;

    try {
      console.log("req.body", req.body);
      const client = await googleService.getClientForUser(userId);
      const slidesApi = google.slides({ version: "v1", auth: client });

      const createRes = await slidesApi.presentations.create({
        requestBody: { title: "My New Deck" },
      });
      const presentationId = createRes.data.presentationId;

      const slideId = req.body.slideId;
      console.log("slideId", slideId);

      await slidesApi.presentations.batchUpdate({
        presentationId: presentationId as string,
        requestBody: {
          requests: [{ createSlide: { objectId: slideId as string } }],
        },
      });

      const batchRequests = req.body.batchRequests;
      if (!Array.isArray(batchRequests) || batchRequests.length === 0) {
        return res
          .status(400)
          .json({ error: "batchRequests missing or invalid." });
      }

      await slidesApi.presentations.batchUpdate({
        presentationId: presentationId as string,
        requestBody: {
          requests: batchRequests as any[],
        },
      });

      const url = `https://docs.google.com/presentation/d/${presentationId}/edit`;

      return res.status(200).json({ url });
    } catch (error: any) {
      console.log("error", error);
      return res.status(500).json({ error: error.message });
    }
  });

  return router;
}


