import Opinion from './opinion.model.js';
import Publication from '../publications/publication.model.js';
import { getUserInfo } from '../clients/user.client.js';

export const createOpinionRecord = async ({ content, publicationId, authorId }) => {
    const publicationExists = await Publication.findById(publicationId);
    if (!publicationExists) throw new Error('Publicación no encontrada');

    const opinion = new Opinion({
        content,
        publication: publicationId,
        author: authorId
    });

    await opinion.save();
    return opinion;
};

export const getOpinionsByPublicationRecord = async (publicationId) => {
    const publicationExists = await Publication.findById(publicationId);
    if (!publicationExists) throw new Error('Publicación no encontrada');

    const opinions = await Opinion.find({ publication: publicationId }).sort({ createdAt: -1 });

    const opinionsWithAuthor = await Promise.all(
        opinions.map(async (opinion) => {
            let user;
            try {
                user = await getUserInfo(opinion.author);
            } catch {
                user = { id: opinion.author, username: 'Desconocido' };
            }
            return { ...opinion.toObject(), author: user };
        })
    );

    return opinionsWithAuthor;
};

export const updateOpinionRecord = async (opinionId, content, userId) => {
    const opinion = await Opinion.findById(opinionId);

    if (!opinion) throw new Error('Opinión no encontrada');
    if (opinion.author.toString() !== userId) throw new Error('No tienes permisos para editar esta opinión');

    opinion.content = content;
    await opinion.save();
    return opinion;
};

export const deleteOpinionRecord = async (opinionId, userId) => {
    const opinion = await Opinion.findById(opinionId);

    if (!opinion) throw new Error('Opinión no encontrada');
    if (opinion.author.toString() !== userId) throw new Error('No tienes permisos para eliminar esta opinión');

    await Opinion.findByIdAndDelete(opinionId);
    return { message: 'Opinión eliminada exitosamente' };
};
