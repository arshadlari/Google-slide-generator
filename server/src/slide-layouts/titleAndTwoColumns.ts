import { z } from "zod";

// Input schema for TITLE_AND_TWO_COLUMNS layout
const TitleAndTwoColumnsInputSchema = z.object({
  TITLE: z.string().optional(),
  LEFT_COLUMN: z.string().optional(),
  RIGHT_COLUMN: z.string().optional(),
});

const TitleAndTwoColumnsLayout = {
  name: "TITLE_AND_TWO_COLUMNS",
  gSlideType: "TITLE_AND_TWO_COLUMNS",
  placeholders: ["TITLE", "LEFT_COLUMN", "RIGHT_COLUMN"],
  inputSchema: TitleAndTwoColumnsInputSchema,

  buildInsertTextRequests(placeholders: any, inputs: any, slideId: string) {
    // Validate inputs
    const validatedInputs = TitleAndTwoColumnsInputSchema.parse(inputs);
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
      } else if (
        el.objectId.endsWith("3") &&
        el.shape.placeholder.type === "BODY" &&
        validatedInputs.RIGHT_COLUMN
      ) {
        requests.push({
          insertText: {
            objectId: el.objectId,
            text: validatedInputs.RIGHT_COLUMN,
            insertionIndex: 0,
          },
        });
      } else if (
        el.shape.placeholder.type === "BODY" &&
        validatedInputs.LEFT_COLUMN
      ) {
        requests.push({
          insertText: {
            objectId: el.objectId,
            text: validatedInputs.LEFT_COLUMN,
            insertionIndex: 0,
          },
        });
      }
    }

    return requests;
  },
};

export default TitleAndTwoColumnsLayout;
