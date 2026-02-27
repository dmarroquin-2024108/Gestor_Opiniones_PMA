import { body } from 'express-validator';
import { checkValidators } from './check-validators.js';

const VALID_CATEGORIES = ['tecnología', 'deportes', 'política', 'entretenimiento', 'ciencia', 'educación', 'salud', 'otros'];

export const validateCreatePublication = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('El título es obligatorio')
        .isLength({ min: 3, max: 150 })
        .withMessage('El título debe tener entre 3 y 150 caracteres'),
    body('category')
        .trim()
        .notEmpty()
        .withMessage('La categoría es obligatoria')
        .isIn(VALID_CATEGORIES)
        .withMessage(`La categoría debe ser una de: ${VALID_CATEGORIES.join(', ')}`),
    body('text')
        .trim()
        .notEmpty()
        .withMessage('El texto de la publicación es obligatorio')
        .isLength({ min: 10, max: 5000 })
        .withMessage('El texto debe tener entre 10 y 5000 caracteres'),
    checkValidators,
];

export const validateUpdatePublication = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 3, max: 150 })
        .withMessage('El título debe tener entre 3 y 150 caracteres'),
    body('category')
        .optional()
        .trim()
        .isIn(VALID_CATEGORIES)
        .withMessage(`La categoría debe ser una de: ${VALID_CATEGORIES.join(', ')}`),
    body('text')
        .optional()
        .trim()
        .isLength({ min: 10, max: 5000 })
        .withMessage('El texto debe tener entre 10 y 5000 caracteres'),
    checkValidators,
];
