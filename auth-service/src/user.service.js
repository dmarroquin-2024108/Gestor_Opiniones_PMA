import User from './user.model.js';
import { hash, verify } from '@node-rs/bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { sendActivationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendPasswordChangedEmail, sendUserEditedEmail } from '../helpers/email.helper.js';

export const createUserRecord = async ({ userData }) => {
    const hashedPassword = await hash(userData.password, 10);
    const activationToken = uuidv4();
    const user = new User({
        ...userData,
        password: hashedPassword,
        activationToken,
        isActive: false
    });
    await user.save();

    await sendActivationEmail(user.email, activationToken, user.firstName);

    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.activationToken;
    return userObject;
};

export const activateUserAccount = async (token) => {
    const user = await User.findOne({ activationToken: token });

    if (!user) {
        throw new Error('Token de activación inválido o expirado');
    }

    if (user.isActive) {
        throw new Error('La cuenta ya está activada');
    }

    user.isActive = true;
    user.activationToken = undefined;
    await user.save();
    
    return user;
};

export const loginUser = async (username, password) => {
    const user = await User.findOne({
        $or: [{ username }, { email: username }]
    });

    if (!user) {
        throw new Error('Credenciales incorrectas');
    }

    if (!user.isActive) {
        throw new Error('Cuenta no activada. Por favor revisa tu correo electrónico');
    }

    const isPasswordValid = await verify(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Credenciales incorrectas');
    }

    const isFirstLogin = user.createdAt.getTime() === user.updatedAt.getTime();
    
    if (isFirstLogin) {
        try {
            await sendWelcomeEmail(user.email, user.firstName, user.username);
        } catch (error) {
            console.error('Error al enviar email de bienvenida:', error);
        }
    }

    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.activationToken;

    return userObject;
};

export const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId);
    
    if (!user) {
        throw new Error('Usuario no encontrado');
    }
    
    const isPasswordValid = await verify(currentPassword, user.password);
    
    if (!isPasswordValid) {
        throw new Error('Contraseña actual incorrecta');
    }
    
    const hashedPassword = await hash(newPassword, 10);
    
    user.password = hashedPassword;
    await user.save();
    await sendPasswordChangedEmail(user.email, user.firstName);
    return { message: 'Contraseña actualizada exitosamente' };
};

export const editUser = async(userId, newEmail, newUsername)=>{
    const user = await User.findById(userId);

    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists && emailExists._id.toString() !== userId) {
        throw new Error('El email ya está en uso');
    }

    const usernameExists = await User.findOne({ username: newUsername });
    if (usernameExists && usernameExists._id.toString() !== userId) {
        throw new Error('El username ya está en uso');
    }

    if (newEmail) {
        const emailExists = await User.findOne({ email: newEmail });
        if (emailExists && !emailExists._id.equals(userId)) {
            throw new Error('El email ya está en uso');
        }
        user.email = newEmail;
    }

    if (newUsername) {
        const usernameExists = await User.findOne({ username: newUsername });
        if (usernameExists && !usernameExists._id.equals(userId)) {
            throw new Error('Username ya está en uso');
        }
        user.username = newUsername;
    }

    await user.save();
    await sendUserEditedEmail(user.email, user.firstName);
    return {message: 'Usuario actualizado exitosamente.'}
}//editarUsuario

export const requestPasswordReset = async(email)=>{
    const user = await User.findOne({ email });
    
    if (!user) {
        throw new Error('No existe un usuario con ese correo electrónico');
    }
    
    if (!user.isActive) {
        throw new Error('La cuenta no está activada');
    }
    const resetToken = uuidv4();
    const resetExpires = new Date(Date.now() + 3600000);
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();
    await sendPasswordResetEmail(user.email, resetToken, user.firstName);
    return { message: 'Se ha enviado un correo con instrucciones para restablecer tu contraseña' };
}//requestPasswordReset

export const resetPassword = async (token, newPassword) => {
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
        throw new Error('Token de recuperación inválido o expirado');
    }
    
    const hashedPassword = await hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    await sendPasswordChangedEmail(user.email, user.firstName);
    
    return { message: 'Contraseña restablecida exitosamente' };
};
