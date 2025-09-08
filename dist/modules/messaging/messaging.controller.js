"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const messaging_service_1 = require("./messaging.service");
const simplified_messaging_service_1 = require("./simplified-messaging.service");
const create_conversation_dto_1 = require("./dto/create-conversation.dto");
const send_message_dto_1 = require("./dto/send-message.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const fs = require("fs");
const path = require("path");
let MessagingController = class MessagingController {
    constructor(messagingService, simplifiedMessagingService) {
        this.messagingService = messagingService;
        this.simplifiedMessagingService = simplifiedMessagingService;
    }
    async getConversations(userId, userRole, req) {
        try {
            const currentUserId = req.user.id;
            console.log(`🔍 API: Récupération des conversations pour l'utilisateur ${currentUserId}`);
            const result = await this.simplifiedMessagingService.getConversationsForUser(currentUserId);
            console.log(`✅ API: ${result.length} conversations retournées`);
            return result;
        }
        catch (error) {
            console.error(`❌ API: Erreur lors de la récupération des conversations:`, error);
            throw error;
        }
    }
    async getConversation(id) {
        return this.messagingService.getConversation(parseInt(id));
    }
    async createConversation(dto) {
        return this.messagingService.createConversation(dto);
    }
    async getMessages(conversationId, req) {
        try {
            const currentUserId = req.user.id;
            console.log(`📨 GET /conversations/${conversationId}/messages - Utilisateur: ${currentUserId}`);
            const messages = await this.simplifiedMessagingService.getMessagesForConversation(parseInt(conversationId), currentUserId);
            console.log(`✅ Messages récupérés avec succès: ${messages.length} messages`);
            return messages;
        }
        catch (error) {
            console.error(`❌ Erreur dans getMessages pour la conversation ${conversationId}:`, error);
            throw error;
        }
    }
    async sendMessage(dto, req) {
        const currentUserId = req.user.id;
        console.log(`📨 Envoi de message:`, dto);
        return this.simplifiedMessagingService.sendMessage(dto.conversationId, currentUserId, dto.content, dto.messageType || 'text', dto.filePath, dto.fileName, dto.fileType);
    }
    async updateMessage(id, updateData, req) {
        const currentUserId = req.user.id;
        const currentUserRole = req.user.role;
        return this.simplifiedMessagingService.updateMessage(parseInt(id), updateData.content, currentUserId, currentUserRole);
    }
    async deleteMessage(id, req) {
        const currentUserId = req.user.id;
        const currentUserRole = req.user.role;
        return this.simplifiedMessagingService.deleteMessage(parseInt(id), currentUserId, currentUserRole);
    }
    async updateConversation(id, updateData, req) {
        const currentUserId = req.user.id;
        const currentUserRole = req.user.role;
        if (currentUserRole !== 'admin') {
            throw new Error('Accès non autorisé - Admin requis');
        }
        return this.simplifiedMessagingService.updateConversation(parseInt(id), updateData, currentUserId);
    }
    async deleteConversation(id, req) {
        const currentUserId = req.user.id;
        const currentUserRole = req.user.role;
        if (currentUserRole !== 'admin') {
            throw new Error('Accès non autorisé - Admin requis');
        }
        return this.simplifiedMessagingService.deleteConversation(parseInt(id), currentUserId);
    }
    async markMessageAsRead(messageId) {
        return this.messagingService.markMessageAsRead(parseInt(messageId));
    }
    async searchMessages(conversationId, query) {
        return this.messagingService.searchMessages(parseInt(conversationId), query);
    }
    async getAvailableRecipients(req) {
        const currentUserId = req.user.id;
        const currentUserRole = req.user.role;
        return this.messagingService.getAvailableRecipients(currentUserId, currentUserRole);
    }
    async createOrGetConversation(req, body) {
        const currentUserId = req.user.id;
        const currentUserRole = req.user.role;
        const recipientId = parseInt(body.recipientId.toString(), 10);
        return this.messagingService.createOrGetConversation(currentUserId, currentUserRole, recipientId);
    }
    async test() {
        return { message: 'Messaging API is working!' };
    }
    async uploadFile(file, req) {
        if (!file) {
            throw new Error('Aucun fichier fourni');
        }
        const userId = req.user?.id;
        if (!userId) {
            throw new Error('Utilisateur non authentifié');
        }
        return this.simplifiedMessagingService.uploadFile(file, userId);
    }
    async downloadFile(messageId, res, req) {
        try {
            const message = await this.simplifiedMessagingService.getMessage(parseInt(messageId));
            if (!message || !message.file_path) {
                return res.status(404).json({ error: 'Fichier non trouvé' });
            }
            const userId = req.user?.id;
            console.log(`🔍 Vérification des permissions pour l'utilisateur ${userId} et le message ${messageId}`);
            const conversation = await this.simplifiedMessagingService.getConversation(message.conversation_id);
            if (!conversation) {
                console.log(`❌ Conversation ${message.conversation_id} non trouvée`);
                return res.status(403).json({ error: 'Conversation non trouvée' });
            }
            const canAccessMessage = await this.simplifiedMessagingService.checkConversationAccess(conversation, userId);
            if (!canAccessMessage) {
                console.log(`❌ Accès refusé: utilisateur ${userId} n'est pas autorisé à accéder à la conversation ${conversation.id}`);
                return res.status(403).json({ error: 'Accès non autorisé à cette conversation' });
            }
            const filePath = path.join(process.cwd(), message.file_path);
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ error: 'Fichier non trouvé sur le serveur' });
            }
            const ext = path.extname(message.file_path).toLowerCase();
            let contentType = 'application/octet-stream';
            if (ext === '.jpg' || ext === '.jpeg')
                contentType = 'image/jpeg';
            else if (ext === '.png')
                contentType = 'image/png';
            else if (ext === '.gif')
                contentType = 'image/gif';
            else if (ext === '.bmp')
                contentType = 'image/bmp';
            else if (ext === '.webp')
                contentType = 'image/webp';
            else if (ext === '.svg')
                contentType = 'image/svg+xml';
            else if (ext === '.mp4')
                contentType = 'video/mp4';
            else if (ext === '.avi')
                contentType = 'video/x-msvideo';
            else if (ext === '.mov')
                contentType = 'video/quicktime';
            else if (ext === '.wmv')
                contentType = 'video/x-ms-wmv';
            else if (ext === '.webm')
                contentType = 'video/webm';
            else if (ext === '.mp3')
                contentType = 'audio/mpeg';
            else if (ext === '.wav')
                contentType = 'audio/wav';
            else if (ext === '.ogg')
                contentType = 'audio/ogg';
            else if (ext === '.m4a')
                contentType = 'audio/mp4';
            else if (ext === '.pdf')
                contentType = 'application/pdf';
            else if (ext === '.doc')
                contentType = 'application/msword';
            else if (ext === '.docx')
                contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            else if (ext === '.xls')
                contentType = 'application/vnd.ms-excel';
            else if (ext === '.xlsx')
                contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            else if (ext === '.ppt')
                contentType = 'application/vnd.ms-powerpoint';
            else if (ext === '.pptx')
                contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
            else if (ext === '.txt')
                contentType = 'text/plain';
            else if (ext === '.csv')
                contentType = 'text/csv';
            else if (ext === '.html')
                contentType = 'text/html';
            else if (ext === '.css')
                contentType = 'text/css';
            else if (ext === '.js')
                contentType = 'application/javascript';
            else if (ext === '.json')
                contentType = 'application/json';
            else if (ext === '.xml')
                contentType = 'application/xml';
            else if (ext === '.zip')
                contentType = 'application/zip';
            else if (ext === '.rar')
                contentType = 'application/x-rar-compressed';
            else if (ext === '.7z')
                contentType = 'application/x-7z-compressed';
            console.log(`📄 Type MIME détecté: ${contentType} pour l'extension ${ext}`);
            const originalFileName = message.content || `fichier${ext}`;
            const stats = fs.statSync(filePath);
            const fileSize = stats.size;
            console.log(`📦 Téléchargement du fichier: ${originalFileName} (${fileSize} bytes)`);
            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${originalFileName}"`);
            res.setHeader('Content-Length', fileSize.toString());
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            const fileStream = fs.createReadStream(filePath);
            fileStream.on('error', (streamError) => {
                console.error('❌ Erreur lors de la lecture du fichier:', streamError);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Erreur lors de la lecture du fichier' });
                }
            });
            fileStream.pipe(res);
            console.log(`✅ Fichier envoyé avec succès: ${originalFileName}`);
        }
        catch (error) {
            console.error('Erreur lors du téléchargement:', error);
            return res.status(500).json({ error: 'Erreur lors du téléchargement du fichier' });
        }
    }
};
exports.MessagingController = MessagingController;
__decorate([
    (0, common_1.Get)('conversations'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('userRole')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "getConversations", null);
__decorate([
    (0, common_1.Get)('conversations/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "getConversation", null);
__decorate([
    (0, common_1.Post)('conversations'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_conversation_dto_1.CreateConversationDto]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "createConversation", null);
__decorate([
    (0, common_1.Get)('conversations/:id/messages'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)('messages'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_message_dto_1.SendMessageDto, Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Patch)('messages/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "updateMessage", null);
__decorate([
    (0, common_1.Delete)('messages/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "deleteMessage", null);
__decorate([
    (0, common_1.Patch)('conversations/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "updateConversation", null);
__decorate([
    (0, common_1.Delete)('conversations/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "deleteConversation", null);
__decorate([
    (0, common_1.Patch)('messages/:id/read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "markMessageAsRead", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('conversationId')),
    __param(1, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "searchMessages", null);
__decorate([
    (0, common_1.Get)('recipients'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "getAvailableRecipients", null);
__decorate([
    (0, common_1.Post)('conversations/create-or-get'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "createOrGetConversation", null);
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "test", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: {
            fileSize: 50 * 1024 * 1024
        }
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)('download/:messageId'),
    __param(0, (0, common_1.Param)('messageId')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MessagingController.prototype, "downloadFile", null);
exports.MessagingController = MessagingController = __decorate([
    (0, common_1.Controller)('messaging'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [messaging_service_1.MessagingService,
        simplified_messaging_service_1.SimplifiedMessagingService])
], MessagingController);
//# sourceMappingURL=messaging.controller.js.map