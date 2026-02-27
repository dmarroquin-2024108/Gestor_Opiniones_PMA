import Publication from './publication.model.js';
import Opinion from '../opinions/opinion.model.js';
import { getUserInfo } from '../clients/user.client.js';

export const createPublicationRecord = async ({ publicationData, authorId }) => {
    const { title, category, text } = publicationData;

    const publication = new Publication({
        title,
        category,
        text,
        author: authorId
    });

    await publication.save();
    return publication;
};

export const getAllPublicationsRecord = async () => {
    const publications = await Publication.find().sort({ createdAt: -1 });

    const publicationsWithCount = await Promise.all(
        publications.map(async (publication) => {
            const opinionCount = await Opinion.countDocuments({ publication: publication._id });
            return { ...publication.toObject(), opinionCount };
        })
    );

    return publicationsWithCount;
};

export const getPublicationByIdRecord = async (publicationId) => {
    const publication = await Publication.findById(publicationId);

    if (!publication) throw new Error('Publicación no encontrada');

    let user;
    try {
        user = await getUserInfo(publication.author);
    } catch {
        user = { id: publication.author, username: 'Desconocido' };
    }

    const opinions = await Opinion.find({ publication: publicationId }).sort({ createdAt: -1 });

    const opinionsWithAuthor = await Promise.all(
        opinions.map(async (opinion) => {
            let opinionAuthor;
            try {
                opinionAuthor = await getUserInfo(opinion.author);
            } catch {
                opinionAuthor = { id: opinion.author, username: 'Desconocido' };
            }
            return { ...opinion.toObject(), author: opinionAuthor };
        })
    );

    return {
        ...publication.toObject(),
        author: user,
        opinionCount: opinionsWithAuthor.length,
        opinions: opinionsWithAuthor
    };
};

export const updatePublicationRecord = async (publicationId, updateData, userId) => {
    const publication = await Publication.findById(publicationId);

    if (!publication) throw new Error('Publicación no encontrada');
    if (publication.author.toString() !== userId) throw new Error('No tienes permisos para editar esta publicación');

    const allowedFields = ['title', 'category', 'text'];
    allowedFields.forEach(field => {
        if (updateData[field] !== undefined) publication[field] = updateData[field];
    });

    await publication.save();
    return publication;
};

export const deletePublicationRecord = async (publicationId, userId) => {
    const publication = await Publication.findById(publicationId);

    if (!publication) throw new Error('Publicación no encontrada');
    if (publication.author.toString() !== userId) throw new Error('No tienes permisos para eliminar esta publicación');

    // Borrado en cascada: elimina todas las opiniones asociadas
    await Opinion.deleteMany({ publication: publicationId });

    await Publication.findByIdAndDelete(publicationId);
    return { message: 'Publicación eliminada exitosamente' };
};
