import {Schema, model} from 'mongoose'

const userSchema = Schema({
    firstName:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        maxLength: [50, 'El nombre no puede exceder de 50 caracteres']
    },

    surname:{
        type: String,
        required: [true, 'El apellido es obligatorio'],
        trim: true,
        maxLength: [50, 'El apellido no puede exceder de 50 caracteres']
    },

    email:{
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        unique: [true, 'El correco electrónico ya existe. Por favor ingrese otro.']
    },

    username:{
        type: String,
        required: [true, 'Username es requerido.'],
        trim: true,
        unique: [true, "Nombre de usuario ya existente. Por favor ingrese otro."],
        maxLength: [40, 'El username no puede excederse de 40 caracteres.']
    },

    password:{
        type:String,
        required: [true, 'La contraseña es obligatoria.'],
        trim: true
    },

    isActive:{
        type: Boolean,
        default: false
    },
    
    activationToken:{type: String},
    resetPasswordToken:{type: String},
    resetPasswordExpires:{type: Date},
},
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('User', userSchema);