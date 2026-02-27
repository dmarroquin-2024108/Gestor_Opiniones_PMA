import { 
    createPublicationRecord,
    getAllPublicationsRecord,
    getPublicationByIdRecord,
    updatePublicationRecord,
    deletePublicationRecord
} from './publication.service.js';

export const createPublication = async (req, res) => {
    try {
        const publication = await createPublicationRecord({
            publicationData: req.body,
            authorId: req.user.id
        });

        res.status(201).json({
            success: true,
            message: 'Publicación creada exitosamente',
            data: publication
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Error al crear la publicación',
            error: e.message
        });
    }
};

export const getAllPublications = async (req, res) => {
    try {
        const publications = await getAllPublicationsRecord();
        res.status(200).json({ success: true, message: 'Publicaciones obtenidas', data: publications });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Error al obtener publicaciones', error: e.message });
    }
};

export const getByIdPublication = async (req, res) => {
    try {
        const publication = await getPublicationByIdRecord(req.params.id);
        res.status(200).json({ success: true, message: 'Publicación obtenida', data: publication });
    } catch (e) {
        const status = e.message === 'Publicación no encontrada' ? 404 : 500;
        res.status(status).json({ success: false, message: e.message });
    }
};

export const updatePublication = async (req, res) => {
    try {
        const publication = await updatePublicationRecord(req.params.id, req.body, req.user.id);
        res.status(200).json({ success: true, message: 'Publicación actualizada', data: publication });
    } catch (e) {
        const status = e.message.includes('No encontrada') ? 404
                     : e.message.includes('Permisos') ? 403 : 500;
        res.status(status).json({ success: false, message: e.message });
    }
};

export const deletePublication = async (req, res) => {
    try {
        const result = await deletePublicationRecord(req.params.id, req.user.id);
        res.status(200).json({ success: true, message: result.message });
    } catch (e) {
        const status = e.message.includes('No encontrada') ? 404
                     : e.message.includes('Permisos') ? 403 : 500;
        res.status(status).json({ success: false, message: e.message });
    }
};