import { z } from "zod";

// Input schema for TITLE and Imagelayout
const TitleAndImageInputSchema = z.object({
  TITLE: z.string().optional(),
  IMAGE: z.string().optional(),
});

const TitleAndImageLayout = {
  name: "TITLE_AND_IMAGE",
  gSlideType: "BLANK",
  placeholders: ["TITLE", "IMAGE"],
  inputSchema: TitleAndImageInputSchema,

  buildInsertTextRequests(placeholders: any, inputs: any, slideId: string) {
    // console.log(`TITLE layout - inputs: ${JSON.stringify(inputs)}`);
    // console.log(`TITLE layout - placeholders: ${JSON.stringify(placeholders)}`);

    // Validate inputs
    const validatedInputs = TitleAndImageInputSchema.parse(inputs);
    const requests = [];
    requests.push(
      {
        createShape: {
          objectId: "MyTextBox_01",
          shapeType: "TEXT_BOX",
          elementProperties: {
            pageObjectId: slideId,
            size: {
              height: {
                magnitude: 100,
                unit: "PT",
              },
              width: {
                magnitude: 300,
                unit: "PT",
              },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 36,
              translateY: 36,
              unit: "PT",
            },
          },
        },
      },
      {
        insertText: {
          objectId: "MyTextBox_01",
          insertionIndex: 0,
          text: validatedInputs.TITLE,
        },
      }
    );

    requests.push({
      createImage: {
        url: validatedInputs.IMAGE,
        elementProperties: {
          pageObjectId: slideId,
          size: {
            width: {
              magnitude: 400,
              unit: "PT",
            },
            height: {
              magnitude: 300,
              unit: "PT",
            },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 300,
            translateY: 100,
            unit: "PT",
          },
        },
      },
    });

    return requests;
  },
};

export default TitleAndImageLayout;
