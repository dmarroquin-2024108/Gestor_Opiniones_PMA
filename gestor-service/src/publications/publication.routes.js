import { Router } from 'express';
import { create, getAll, getById, update, remove } from './publication.controller.js';
import {validateCreatePublication,validateUpdatePublication} from '../../middlewares/publication-validator.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router();

router.post('/', validateJWT, validateCreatePublication, create);
router.get('/', validateJWT, getAll);
router.get('/:id', validateJWT, getById);
router.put('/:id', validateJWT, validateUpdatePublication, update);
router.delete('/:id', validateJWT, remove);

export default router;
