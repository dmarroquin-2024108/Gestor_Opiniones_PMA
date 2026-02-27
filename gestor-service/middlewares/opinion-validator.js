import { body } from 'express-validator';
import { checkValidators } from './check-validators.js';

export const validateCreateOpinion = [
    body('content')
        .trim()
        .notEmpty()
        .withMessage('El contenido de la opinión es obligatorio')
        .isLength({ min: 5, max: 1000 })
        .withMessage('La opinión debe tener entre 5 y 1000 caracteres'),
    checkValidators,
];

export const validateUpdateOpinion = [
    body('content')
        .trim()
        .notEmpty()
        .withMessage('El contenido de la opinión es obligatorio')
        .isLength({ min: 5, max: 1000 })
        .withMessage('La opinión debe tener entre 5 y 1000 caracteres'),
    checkValidators,
];
