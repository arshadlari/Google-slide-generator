import { z } from "zod";

// Import all layout modules
import TitleLayout from "./title.ts";
import CenteredTitleLayout from "./centeredTitle.ts";
import TitleAndBodyLayout from "./titleAndBody.ts";
import TitleAndTwoColumnsLayout from "./titleAndTwoColumns.ts";
import TitleOnlyLayout from "./titleOnly.ts";
import SubtitleLayout from "./subtitle.ts";
import TitleAndImageLayout from "./titleAndImage.ts";

// Layout registry
const layouts = {
  TITLE: TitleLayout,
  TITLE_AND_BODY: TitleAndBodyLayout,
  TITLE_AND_TWO_COLUMNS: TitleAndTwoColumnsLayout,
  TITLE_ONLY: TitleOnlyLayout,
  CENTERED_TITLE: CenteredTitleLayout,
  SUBTITLE: SubtitleLayout,
  TITLE_AND_IMAGE: TitleAndImageLayout,
};

// Schema for layout names
const LayoutNameSchema = z.enum([
  "TITLE",
  "TITLE_AND_BODY",
  "TITLE_AND_TWO_COLUMNS",
  "TITLE_ONLY",
  "CENTERED_TITLE",
  "SUBTITLE",
  "TITLE_AND_IMAGE",
]);

class LayoutRegistry {
  static getLayout(layoutName: string) {
    // Validate layout name
    const validatedLayoutName = LayoutNameSchema.parse(layoutName);

    const layout = layouts[validatedLayoutName as keyof typeof layouts];
    if (!layout) {
      throw new Error(`Layout '${layoutName}' not found`);
    }
    console.log("layout in getLayout: ", layout);

    return layout;
  }

  static getAvailableLayouts() {
    return Object.keys(layouts);
  }

  static getLayoutPlaceholders(layoutName: string) {
    const layout = this.getLayout(layoutName);
    return layout.placeholders;
  }

  static buildInsertTextRequests(
    layoutName: string,
    placeholders: any,
    inputs: any,
    slideId: string
  ) {
    console.log("layoutName in buildInsertTextRequests: ", layoutName);
    const layout = this.getLayout(layoutName);

    try {
      return layout.buildInsertTextRequests(placeholders, inputs, slideId);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(
          `Validation error for layout '${layoutName}':`,
          (error as any).errors
        );
        throw new Error(
          `Invalid inputs for layout '${layoutName}': ${(error as any).errors
            .map((e: any) => (e as any).message)
            .join(", ")}`
        );
      }
      throw error;
    }
  }

  static validateInputs(layoutName: string, inputs: any) {
    const layout = this.getLayout(layoutName);

    if (layout.inputSchema) {
      return layout.inputSchema.parse(inputs);
    }

    return inputs;
  }
}

export { LayoutRegistry, LayoutNameSchema };
