import Publication from './publication.model.js';

export const createPublication = async ({ publicationData, authorId }) => {
    const publication = new Publication({
        ...publicationData,
        author: authorId
    });

    await publication.save();

    const populated = await publication.populate('author', 'firstName surname username');
    return populated;
}; //createPublication

export const getAllPublications = async () => {
    const publications = await Publication.find()
        .populate('author', 'firstName surname username')
        .sort({ createdAt: -1 });

    return publications;
}; //getAllPublications

export const getPublicationById = async (publicationId) => {
    const publication = await Publication.findById(publicationId)
        .populate('author', 'firstName surname username');

    if (!publication) {
        throw new Error('Publicación no encontrada');
    }

    return publication;
}; //getPublicationById

export const updatePublication = async (publicationId, updateData, userId) => {
    const publication = await Publication.findById(publicationId);

    if (!publication) {
        throw new Error('Publicación no encontrada');
    }

    if (publication.author.toString() !== userId) {
        throw new Error('No tienes permisos para editar esta publicación');
    }

    // Solo actualizar campos permitidos
    const allowedFields = ['title', 'category', 'text'];
    allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
            publication[field] = updateData[field];
        }
    });

    await publication.save();

    const updated = await Publication.findById(publicationId)
        .populate('author', 'firstName surname username');

    return updated;
}; //updatePublication

export const deletePublication = async (publicationId, userId) => {
    const publication = await Publication.findById(publicationId);

    if (!publication) {
        throw new Error('Publicación no encontrada');
    }

    if (publication.author.toString() !== userId) {
        throw new Error('No tienes permisos para eliminar esta publicación');
    }

    await Publication.findByIdAndDelete(publicationId);

    return { message: 'Publicación eliminada exitosamente' };
}; //deletePublication
