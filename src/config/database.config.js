"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
exports.databaseConfig = {
    type: 'mysql',
    host: process.env.DB_HOST || '51.77.195.224',
    port: parseInt(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'chrono_user',
    password: process.env.DB_PASSWORD || 'Abu3soib2004@',
    database: process.env.DB_NAME || 'chrono_carto',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false, // Set to true only in development
    logging: true,
};
