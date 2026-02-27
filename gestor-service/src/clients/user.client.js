import axios from 'axios';

export const getUserInfo = async (userId) => {
    try {
        const response = await axios.get(`${process.env.USER_SERVICE_URL}/users/${userId}`);
        return response.data;
    } catch (error) {
        return { id: userId, username: 'Desconocido' };
    }
};