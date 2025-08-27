import { PageProperties } from "./PageProperties.ts";
import { Slide } from "./Slide.ts";
import { ImageElement } from "./elements/ImageElement.ts";
import { ShapeElement } from "./elements/ShapeElement.ts";

const slideId = "center_text_black_akqa";




const slide = new Slide(slideId, [], undefined);

let image = new ImageElement({
  id: "image",
  slideId: slideId,
  position: {
    width: 51200,
    height: 34150,
    scaleX: 178.5938,
    scaleY: 150.6149
  },
  imageUrl: "https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630",
  imageProperties: {
    "cropProperties": {
      "leftOffset": 0,
      "topOffset": 0,
      "bottomOffset": 0.15668744
    }
  },
});

slide.addElement(image);

// let shape = new ShapeElement({
//   id: "center_text",
//   slideId: slideId,
//   type: "TEXT_BOX",
//   position: {
//     x: 1318200,
//     y: 2310600,
//     width: 3000000,
//     height: 3000000,
//     scaleX:  2.1692,
//     scaleY: 0.1741,
//     rotation: 0,
//     zIndex: 0,
//   },
//   textStyle: {
//     text: "The imaginative application of art and science, \nto create differentiated and memorable\nexperiences that deliver real business value.",
//     fontFamily: "Sorts Mill Goudy",
//     fontSize: 24,
//     color: "#FFFFFF",
//     contentAlignment: "MIDDLE",
//     paragraphStyle: {
//       alignment: "CENTER",
//     },
//   },
// });

// slide.addElement(shape);

// shape = new ShapeElement({
//   id: "description",
//   slideId: slideId,
//   type: "TEXT_BOX",
//   position: {
//     x: 207725,
//     y: 2040150,
//     width: 3000000,
//     height: 3000000,
//     scaleX: 1.5617,
//     scaleY: 0.3544,
//     rotation: 0,
//     zIndex: 0,
//   },
//   textStyle: {
//     text: "This template is meant to set design guidelines for new deck creation. Please make a copy of the full deck and/or paste these slides into new presentations, rather than working directly from this deck. Thank you!\n",
//     fontFamily: "Sorts Mill Goudy",
//     fontSize: 15,
//     color: "#FFFFFF"
//   },
//   paragraphStyle: {
//     paragraphAlignment: "START",
//     lineSpacing: 100,
//   },
// });

// slide.addElement(shape);



console.log(JSON.stringify(slide));
const requests = slide.toBatchRequests();
console.log(JSON.stringify(requests));
