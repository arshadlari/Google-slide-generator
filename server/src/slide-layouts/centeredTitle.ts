import { z } from "zod";

// Input schema for CENTERED_TITLE layout
const CenteredTitleInputSchema = z.object({
  CENTERED_TITLE: z.string().optional(),
});

const CenteredTitleLayout = {
  name: "CENTERED_TITLE",
  gSlideType: "CENTERED_TITLE",
  placeholders: ["CENTERED_TITLE"],
  inputSchema: CenteredTitleInputSchema,

  buildInsertTextRequests(placeholders: any, inputs: any, slideId: string) {
    console.log(`CENTERED_TITLE layout - inputs: ${JSON.stringify(inputs)}`);
    console.log(
      `CENTERED_TITLE layout - placeholders: ${JSON.stringify(placeholders)}`
    );

    // Validate inputs
    const validatedInputs = CenteredTitleInputSchema.parse(inputs);
    const requests = [];

    for (const el of placeholders) {
      if (
        el.shape.placeholder.type === "CENTERED_TITLE" &&
        validatedInputs.CENTERED_TITLE
      ) {
        requests.push({
          insertText: {
            objectId: el.objectId,
            text: validatedInputs.CENTERED_TITLE,
            insertionIndex: 0,
          },
        });
      }
    }

    return requests;
  },
};

export default CenteredTitleLayout;
