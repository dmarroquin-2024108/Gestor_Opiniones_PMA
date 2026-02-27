import { Schema, model } from 'mongoose';

const publicationSchema = new Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  text: { type: String, required: true, trim: true },
  author: { type: Schema.Types.ObjectId, required: true }, // sin ref
}, { timestamps: true, versionKey: false });

export default model('Publication', publicationSchema);