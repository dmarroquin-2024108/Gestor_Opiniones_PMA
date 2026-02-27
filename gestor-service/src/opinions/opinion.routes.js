import { Router } from 'express';
import {
    createOpinion,
    getOpinionsByPublication,
    updateOpinion,
    deleteOpinion
} from './opinion.controller.js';
import { validateCreateOpinion, validateUpdateOpinion } from '../../middlewares/opinion-validator.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';

const router = Router({ mergeParams: true });

router.post('/', validateJWT, validateCreateOpinion, createOpinion);
router.get('/', validateJWT, getOpinionsByPublication);

router.put('/:id', validateJWT, validateUpdateOpinion, updateOpinion);
router.delete('/:id', validateJWT, deleteOpinion);

export default router;
