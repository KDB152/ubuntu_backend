"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const path_1 = require("path");
require("dotenv/config");
const security_headers_middleware_1 = require("./common/security/security-headers.middleware");
const rate_limiter_middleware_1 = require("./common/security/rate-limiter.middleware");
const csrf_middleware_1 = require("./common/security/csrf.middleware");
const helmet_1 = require("helmet");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'", "http://localhost:3001"],
            },
        },
        crossOriginEmbedderPolicy: false,
    }));
    app.use(new security_headers_middleware_1.SecurityHeadersMiddleware().use.bind(new security_headers_middleware_1.SecurityHeadersMiddleware()));
    app.use(new rate_limiter_middleware_1.RateLimiterMiddleware().use.bind(new rate_limiter_middleware_1.RateLimiterMiddleware()));
    app.use(new csrf_middleware_1.CsrfMiddleware().use.bind(new csrf_middleware_1.CsrfMiddleware()));
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://192.168.1.11:3000',
            'http://192.168.1.11:3001',
            process.env.FRONTEND_URL || 'http://localhost:3000'
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: false,
        },
        disableErrorMessages: process.env.NODE_ENV === 'production',
    }));
    const port = process.env.PORT || 3001;
    await app.listen(port, '0.0.0.0');
    logger.log(`🚀 Serveur démarré sur http://0.0.0.0:${port}`);
    logger.log(`📧 Email configuré: ${process.env.EMAIL_USER}`);
    logger.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
    logger.log(`🗄️ Base de données: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
}
bootstrap().catch((error) => {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map