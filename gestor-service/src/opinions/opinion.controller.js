import {
    createOpinionRecord,
    getOpinionsByPublicationRecord,
    updateOpinionRecord,
    deleteOpinionRecord
} from './opinion.service.js';

export const createOpinion = async (req, res) => {
    try {
        const { content } = req.body;
        const { publicationId } = req.params;

        const opinion = await createOpinionRecord({
            content,
            publicationId,
            authorId: req.user.id
        });

        res.status(201).json({
            success: true,
            message: 'Opinión creada exitosamente',
            data: opinion
        });
    } catch (e) {
        const status = e.message === 'Publicación no encontrada' ? 404 : 500;
        res.status(status).json({ success: false, message: e.message });
    }
};

export const getOpinionsByPublication = async (req, res) => {
    try {
        const opinions = await getOpinionsByPublicationRecord(req.params.publicationId);
        res.status(200).json({ success: true, message: 'Opiniones obtenidas', data: opinions });
    } catch (e) {
        const status = e.message === 'Publicación no encontrada' ? 404 : 500;
        res.status(status).json({ success: false, message: e.message });
    }
};

export const updateOpinion = async (req, res) => {
    try {
        const opinion = await updateOpinionRecord(req.params.id, req.body.content, req.user.id);
        res.status(200).json({ success: true, message: 'Opinión actualizada exitosamente', data: opinion });
    } catch (e) {
        const status = e.message.includes('no encontrada') ? 404
                     : e.message.includes('permisos') ? 403 : 500;
        res.status(status).json({ success: false, message: e.message });
    }
};

export const deleteOpinion = async (req, res) => {
    try {
        const result = await deleteOpinionRecord(req.params.id, req.user.id);
        res.status(200).json({ success: true, message: result.message });
    } catch (e) {
        const status = e.message.includes('no encontrada') ? 404
                     : e.message.includes('permisos') ? 403 : 500;
        res.status(status).json({ success: false, message: e.message });
    }
};
