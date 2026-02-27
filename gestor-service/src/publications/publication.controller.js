import {
    createPublication,
    getAllPublications,
    getPublicationById,
    updatePublication,
    deletePublication
} from './publication.service.js';

export const create = async (req, res) => {
    try {
        const publication = await createPublication({
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
}; //create

export const getAll = async (req, res) => {
    try {
        const publications = await getAllPublications();

        res.status(200).json({
            success: true,
            message: 'Publicaciones obtenidas exitosamente',
            data: publications
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las publicaciones',
            error: e.message
        });
    }
}; //getAll

export const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const publication = await getPublicationById(id);

        res.status(200).json({
            success: true,
            message: 'Publicación obtenida exitosamente',
            data: publication
        });
    } catch (e) {
        const status = e.message === 'Publicación no encontrada' ? 404 : 500;
        res.status(status).json({
            success: false,
            message: 'Error al obtener la publicación',
            error: e.message
        });
    }
}; //getById

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const publication = await updatePublication(id, req.body, req.user.id);

        res.status(200).json({
            success: true,
            message: 'Publicación actualizada exitosamente',
            data: publication
        });
    } catch (e) {
        const status = e.message.includes('no encontrada') ? 404
            : e.message.includes('permisos') ? 403 : 500;
        res.status(status).json({
            success: false,
            message: 'Error al actualizar la publicación',
            error: e.message
        });
    }
}; //update

export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deletePublication(id, req.user.id);

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (e) {
        const status = e.message.includes('no encontrada') ? 404
            : e.message.includes('permisos') ? 403 : 500;
        res.status(status).json({
            success: false,
            message: 'Error al eliminar la publicación',
            error: e.message
        });
    }
}; //remove
