import { Schema, model } from 'mongoose';

const opinionSchema = new Schema({
    content: {
        type: String,
        required: [true, 'El contenido de la opinión es obligatorio'],
        trim: true,
        minLength: [5, 'La opinión debe tener al menos 5 caracteres'],
        maxLength: [1000, 'La opinión no puede exceder 1000 caracteres']
    },
    publication: {
        type: Schema.Types.ObjectId,
        required: [true, 'La publicación es obligatoria']
    },
    author: {
        type: Schema.Types.ObjectId,
        required: [true, 'El autor es obligatorio']
    }
}, { timestamps: true, versionKey: false });

export default model('Opinion', opinionSchema);
