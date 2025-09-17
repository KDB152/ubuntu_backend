"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const dotenv = require("dotenv");
dotenv.config();
exports.databaseConfig = {
    type: 'mysql',
    host: process.env.DB_HOST || '51.77.195.224',
    port: parseInt(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'chrono_user',
    password: process.env.DB_PASSWORD || 'Abu3soib2004@',
    database: process.env.DB_NAME || 'chrono_carto',
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/src/migrations/*.js'],
    synchronize: false,
    logging: true,
    dropSchema: false,
    migrationsRun: false,
};
exports.default = new typeorm_1.DataSource({
    ...exports.databaseConfig,
    type: 'mysql',
    synchronize: false,
    migrationsRun: false,
    migrations: ['src/migrations/*.ts'],
});
//# sourceMappingURL=database.config.js.map