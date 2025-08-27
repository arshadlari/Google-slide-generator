import mongoose from 'mongoose';

const slideSchema = new mongoose.Schema({
  slideId: { type: String, required: true },
  layout: { type: String, required: true },
  contentModel: { type: String, required: true },
  inputs: { type: mongoose.Schema.Types.Mixed, required: true }  // Flexible
}, { _id: false });

const deckSchema = new mongoose.Schema({
  presentationId: { type: String, required: true },
  title: { type: String, required: true },
  outline: String,
  themeId: mongoose.Schema.Types.String,
  createdBy: mongoose.Schema.Types.String,
  owner: mongoose.Schema.Types.String,
  updatedBy: mongoose.Schema.Types.String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  slidesJson: {
    slides: { type: [slideSchema], default: [] }
  }
});

// Specify collection name comes as decks
export const DeckModel = mongoose.model('deck', deckSchema);