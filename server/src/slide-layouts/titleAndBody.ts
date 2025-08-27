import { z } from "zod";

// Input schema for TITLE_AND_BODY layout
const TitleAndBodyInputSchema = z.object({
  TITLE: z.string().optional(),
  BODY: z.string().optional(),
});

const TitleAndBodyLayout = {
  name: "TITLE_AND_BODY",
  gSlideType: "TITLE_AND_BODY",
  placeholders: ["TITLE", "BODY"],
  inputSchema: TitleAndBodyInputSchema,

  buildInsertTextRequests(placeholders: any, inputs: any, slideId: string) {
    // Validate inputs
    const validatedInputs = TitleAndBodyInputSchema.parse(inputs);
    const requests = [];

    for (const el of placeholders) {
      if (el.shape.placeholder.type === "TITLE" && validatedInputs.TITLE) {
        requests.push({
          insertText: {
            objectId: el.objectId,
            text: validatedInputs.TITLE,
            insertionIndex: 0,
          },
        });
      } else if (el.shape.placeholder.type === "BODY" && validatedInputs.BODY) {
        requests.push({
          insertText: {
            objectId: el.objectId,
            text: validatedInputs.BODY,
            insertionIndex: 0,
          },
        });
      }
    }

    return requests;
  },
};

export default TitleAndBodyLayout;
