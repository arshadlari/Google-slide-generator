import TitleLayout from "./layouts/TitleLayout";
import TitleAndBodyLayout from "./layouts/TitleAndBodyLayout";
import TitleAndImageLayout from "./layouts/TitleAndImageLayout";
import TwoColumnLayout from "./layouts/TwoColumnLayout";
import MethodologySlide from "./layouts/MethodoloySlide";

const layoutRegister = [
  // {
  //   key: "TITLE",
  //   name: "Title",
  //   component: TitleLayout,
  // },
  // {
  //   key: "TITLE_AND_BODY",
  //   name: "Title and Body",
  //   component: TitleAndBodyLayout,
  // },
  // {
  //   key: "TITLE_AND_IMAGE",
  //   name: "Title and Image",
  //   component: TitleAndImageLayout,
  // },
  // {
  //   key: "TITLE_AND_TWO_COLUMNS",
  //   name: "Title and Two Column",
  //   component: TwoColumnLayout,
  // },
  // {
  //   key: "METHODOLOGY",
  //   name: "Methodology",
  //   component: MethodologySlide,
  // },
];

const getSlideLayouts = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/content-models", {
      credentials: "include",
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    console.log("slide layouts from server", data.contentModels);

    if (data.contentModels) {
      // console.log(JSON.stringify(data, null, 2));
      return data.contentModels;
    } else {
      console.log("Failed to fetch layouts");
      return [];
    }
  } catch (error) {
    console.error("Error fetching layouts:", error);
    return [];
  }
};

const data = await getSlideLayouts();
// const data = [];


export { layoutRegister, data };
