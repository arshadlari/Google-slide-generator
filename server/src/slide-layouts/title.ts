import { z } from "zod";

// Input schema for TITLE layout
const TitleInputSchema = z.object({
  TITLE: z.string().optional(),
});

const TitleLayout = {
  name: "TITLE",
  gSlideType: "TITLE",
  placeholders: ["TITLE"],
  inputSchema: TitleInputSchema,

  buildInsertTextRequests(placeholders: any, inputs: any, slideId: string) {
    // console.log(`TITLE layout - inputs: ${JSON.stringify(inputs)}`);
    // console.log(`TITLE layout - placeholders: ${JSON.stringify(placeholders)}`);

    // Validate inputs
    const validatedInputs = TitleInputSchema.parse(inputs);
    const requests = [];

    for (const el of placeholders) {
      if (
        el.shape.placeholder.type === "CENTERED_TITLE" &&
        validatedInputs.TITLE
      ) {
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

export default TitleLayout;
