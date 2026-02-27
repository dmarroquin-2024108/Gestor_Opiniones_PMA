import { Schema, model } from 'mongoose';

const publicationSchema = new Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true,
        minLength: [3, 'El título debe tener al menos 3 caracteres'],
        maxLength: [150, 'El título no puede exceder de 150 caracteres']
    },
    category: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        trim: true,
        enum: {
            values: ['tecnología', 'deportes', 'política', 'entretenimiento', 'ciencia', 'educación', 'salud', 'otros'],
            message: 'Categoría no válida'
        }
    },
    text: {
        type: String,
        required: [true, 'El texto de la publicación es obligatorio'],
        trim: true,
        minLength: [10, 'El texto debe tener al menos 10 caracteres'],
        maxLength: [5000, 'El texto no puede exceder de 5000 caracteres']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El autor es obligatorio']
    }
}, {
    timestamps: true,
    versionKey: false,
}); //publicationSchema

export default model('Publication', publicationSchema);
