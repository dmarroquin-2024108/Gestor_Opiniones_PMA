'use strict'

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions } from './cors.configuration.js';
import { helmetOptions } from './helmet.configuration.js';
import { dbConnection } from './db.configuration.js';
import { requestLimit } from './rateLimit.configuration.js';
import { errorHandler } from '../middlewares/handle-errors.js';
import publicationRoutes from '../src/publications/publication.routes.js';
import opinionRoutes from '../src/opinions/opinion.routes.js';

const BASE_PATH = '/gestorAdmin/v1';

const routes = (app) => {
    app.use(`${BASE_PATH}/publications`, publicationRoutes);

    app.use(`${BASE_PATH}/publications/:publicationId/opinions`, opinionRoutes);//relaciona la publicacion con las opiniones

    app.use(`${BASE_PATH}/opinions`, opinionRoutes);

    app.get(`${BASE_PATH}/health`, (req, res) => {
        res.status(200).json({
            status: 'Healthy',
            timeStamp: new Date().toISOString(),
            service: 'Gestor Opiniones Admin Server'
        });
    });

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Endpoint no encontrado'
        });
    });
};

const middlewares = (app) => {
    app.use(cors(corsOptions));
    app.use(helmet(helmetOptions));
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(requestLimit);
};

export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT;
    app.set('trust proxy', 1);

    try {
        middlewares(app);
        await dbConnection();

        routes(app);
        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`Gestor Opiniones Server running on port: ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}${BASE_PATH}/health`);
        });
    } catch (e) {
        console.error(`Error al iniciar el servidor: ${e.message}`);
        process.exit(1);
    }
};
