import { Router } from 'express';
import { 
    createPublication, 
    getAllPublications, 
    getByIdPublication, 
    updatePublication, 
    deletePublication 
} from './publication.controller.js';
import { validateCreatePublication, validateUpdatePublication } from '../../middlewares/publication-validator.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

router.post('/', validateJWT, validateCreatePublication, createPublication);
router.get('/', validateJWT, getAllPublications);
router.get('/:id', validateJWT, getByIdPublication);
router.put('/:id', validateJWT, validateUpdatePublication, updatePublication);
router.delete('/:id', validateJWT, deletePublication);

export default router;