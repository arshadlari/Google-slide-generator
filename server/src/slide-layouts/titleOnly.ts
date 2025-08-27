import { z } from "zod";

// Input schema for TITLE_ONLY layout
const TitleOnlyInputSchema = z.object({
  TITLE: z.string().optional(),
});

const TitleOnlyLayout = {
  name: "TITLE_ONLY",
  gSlideType: "TITLE_ONLY",
  placeholders: ["TITLE"],
  inputSchema: TitleOnlyInputSchema,

  buildInsertTextRequests(placeholders: any, inputs: any, slideId: string) {
    console.log(`TITLE_ONLY layout - inputs: ${JSON.stringify(inputs)}`);
    console.log(
      `TITLE_ONLY layout - placeholders: ${JSON.stringify(placeholders)}`
    );

    // Validate inputs
    const validatedInputs = TitleOnlyInputSchema.parse(inputs);
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
      }
    }

    return requests;
  },
};

export default TitleOnlyLayout;
