import { z } from "zod";

// Input schema for SUBTITLE layout
const SubtitleInputSchema = z.object({
  SUBTITLE: z.string().optional(),
});

const SubtitleLayout = {
  name: "SUBTITLE",
  gSlideType: "SUBTITLE",
  placeholders: ["SUBTITLE"],
  inputSchema: SubtitleInputSchema,

  buildInsertTextRequests(placeholders: any, inputs: any, slideId: string) {
    console.log(`SUBTITLE layout - inputs: ${JSON.stringify(inputs)}`);
    console.log(
      `SUBTITLE layout - placeholders: ${JSON.stringify(placeholders)}`
    );

    // Validate inputs
    const validatedInputs = SubtitleInputSchema.parse(inputs);
    const requests = [];

    for (const el of placeholders) {
      if (
        el.shape.placeholder.type === "SUBTITLE" &&
        validatedInputs.SUBTITLE
      ) {
        requests.push({
          insertText: {
            objectId: el.objectId,
            text: validatedInputs.SUBTITLE,
            insertionIndex: 0,
          },
        });
      }
    }

    return requests;
  },
};

export default SubtitleLayout;
