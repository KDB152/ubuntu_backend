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
exports.MessagingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const conversation_entity_1 = require("./entities/conversation.entity");
const message_entity_1 = require("./entities/message.entity");
const groupe_entity_1 = require("./entities/groupe.entity");
const user_entity_1 = require("../users/entities/user.entity");
const student_entity_1 = require("../students/entities/student.entity");
const parent_entity_1 = require("../parents/entities/parent.entity");
const parent_student_entity_1 = require("../relations/entities/parent-student.entity");
const group_service_1 = require("./group.service");
let MessagingService = class MessagingService {
    constructor(conversationRepository, messageRepository, groupeRepository, userRepository, studentRepository, parentRepository, parentStudentRepository, groupService) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.groupeRepository = groupeRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.parentRepository = parentRepository;
        this.parentStudentRepository = parentStudentRepository;
        this.groupService = groupService;
    }
    async getConversations(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['student', 'parent']
        });
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        const conversations = await this.conversationRepository
            .createQueryBuilder('conversation')
            .leftJoinAndSelect('conversation.participants', 'participants')
            .leftJoinAndSelect('participants.user', 'user')
            .leftJoinAndSelect('conversation.groupe', 'groupe')
            .where('participants.user_id = :userId', { userId })
            .orderBy('conversation.updated_at', 'DESC')
            .getMany();
        const formattedConversations = [];
        for (const conversation of conversations) {
            const otherParticipant = conversation.participant1_id === userId ?
                conversation.participant2 : conversation.participant1;
            if (user.role === 'admin') {
                if (conversation.groupe) {
                    formattedConversations.push({
                        id: conversation.id,
                        type: 'group',
                        title: conversation.groupe.title,
                        class_level: conversation.groupe.class_level,
                        participants: otherParticipant ? [{
                                id: otherParticipant.id,
                                firstName: otherParticipant.firstName,
                                lastName: otherParticipant.lastName,
                                role: otherParticipant.role
                            }] : [],
                        last_message: null,
                        created_at: conversation.created_at,
                        updated_at: conversation.updated_at
                    });
                }
                else {
                    const parentParticipant = otherParticipant;
                    if (parentParticipant) {
                        formattedConversations.push({
                            id: conversation.id,
                            type: 'direct',
                            title: `${parentParticipant.firstName} ${parentParticipant.lastName}`,
                            participants: otherParticipant ? [{
                                    id: otherParticipant.id,
                                    firstName: otherParticipant.firstName,
                                    lastName: otherParticipant.lastName,
                                    role: otherParticipant.role
                                }] : [],
                            last_message: null,
                            created_at: conversation.created_at,
                            updated_at: conversation.updated_at
                        });
                    }
                }
            }
            else if (user.role === 'student') {
                if (conversation.groupe) {
                    if (user.student && user.student.class_level === conversation.groupe.class_level) {
                        formattedConversations.push({
                            id: conversation.id,
                            type: 'group',
                            title: conversation.groupe.title,
                            class_level: conversation.groupe.class_level,
                            participants: otherParticipant ? [{
                                    id: otherParticipant.id,
                                    firstName: otherParticipant.firstName,
                                    lastName: otherParticipant.lastName,
                                    role: otherParticipant.role
                                }] : [],
                            last_message: null,
                            created_at: conversation.created_at,
                            updated_at: conversation.updated_at
                        });
                    }
                }
                else {
                    const parentParticipant = otherParticipant;
                    if (parentParticipant) {
                        formattedConversations.push({
                            id: conversation.id,
                            type: 'direct',
                            title: `${parentParticipant.firstName} ${parentParticipant.lastName}`,
                            participants: otherParticipant ? [{
                                    id: otherParticipant.id,
                                    firstName: otherParticipant.firstName,
                                    lastName: otherParticipant.lastName,
                                    role: otherParticipant.role
                                }] : [],
                            last_message: null,
                            created_at: conversation.created_at,
                            updated_at: conversation.updated_at
                        });
                    }
                }
            }
            else if (user.role === 'parent') {
                if (otherParticipant) {
                    formattedConversations.push({
                        id: conversation.id,
                        type: 'direct',
                        title: otherParticipant.role === 'admin'
                            ? 'Administrateur'
                            : `${otherParticipant.firstName} ${otherParticipant.lastName}`,
                        participants: otherParticipant ? [{
                                id: otherParticipant.id,
                                firstName: otherParticipant.firstName,
                                lastName: otherParticipant.lastName,
                                role: otherParticipant.role
                            }] : [],
                        last_message: null,
                        created_at: conversation.created_at,
                        updated_at: conversation.updated_at
                    });
                }
            }
        }
        return formattedConversations;
    }
    async getConversation(id) {
        return this.conversationRepository.findOne({
            where: { id },
            relations: ['participants', 'participants.user', 'groupe']
        });
    }
    async createConversation(dto) {
        throw new Error('Cette méthode est obsolète. Les conversations sont créées automatiquement.');
    }
    async getMessages(conversationId) {
        const messages = await this.messageRepository.find({
            where: { conversation_id: conversationId },
            relations: ['sender', 'recipient'],
            order: { created_at: 'ASC' }
        });
        console.log('🔍 Messages retrieved for conversation', conversationId, ':', JSON.stringify(messages.map(m => ({
            id: m.id,
            content: m.content,
            sender_id: m.sender_id,
            sender: m.sender ? { id: m.sender.id, first_name: m.sender.firstName, last_name: m.sender.lastName } : null
        })), null, 2));
        return messages;
    }
    async getMessage(messageId) {
        return this.messageRepository.findOne({
            where: { id: messageId },
            relations: ['sender', 'recipient']
        });
    }
    async sendMessage(dto) {
        if (dto.senderId === dto.recipientId) {
            throw new Error('Vous ne pouvez pas vous envoyer un message à vous-même');
        }
        const message = this.messageRepository.create({
            conversation_id: dto.conversationId,
            sender_id: dto.senderId,
            recipient_id: dto.recipientId || null,
            groupe_id: dto.groupeId || null,
            content: dto.content,
            message_type: dto.messageType || 'text',
            file_path: dto.filePath || null
        });
        const savedMessage = await this.messageRepository.save(message);
        await this.conversationRepository.update(dto.conversationId, {
            last_message_id: savedMessage.id,
            updated_at: new Date()
        });
        return savedMessage;
    }
    async markMessageAsRead(messageId) {
        return this.messageRepository.update(messageId, { is_read: true });
    }
    async searchMessages(conversationId, query) {
        return this.messageRepository
            .createQueryBuilder('message')
            .where('message.conversation_id = :conversationId', { conversationId })
            .andWhere('message.content LIKE :query', { query: `%${query}%` })
            .orderBy('message.created_at', 'ASC')
            .getMany();
    }
    async uploadFile(file, userId) {
        const fs = require('fs');
        const path = require('path');
        const uploadsDir = path.join(process.cwd(), 'uploads', 'messages');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const fileExtension = path.extname(file.originalname);
        const fileName = path.basename(file.originalname, fileExtension);
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const storedName = `message-${timestamp}-${randomSuffix}-${fileName}${fileExtension}`;
        const filePath = path.join('uploads', 'messages', storedName);
        const fullPath = path.join(process.cwd(), filePath);
        fs.writeFileSync(fullPath, file.buffer);
        console.log('✅ Fichier de message sauvegardé:', fullPath);
        return {
            fileName: file.originalname,
            storedName,
            filePath,
            fileType: file.mimetype,
            fileSize: file.size
        };
    }
    async getAvailableRecipients(currentUserId, currentUserRole) {
        return this.groupService.getAvailableRecipients(currentUserId, currentUserRole);
    }
    async updateMessage(messageId, newContent, currentUserId, currentUserRole) {
        console.log(`🔍 Utilisateur ${currentUserId} (${currentUserRole}) met à jour le message ${messageId} avec le contenu: ${newContent}`);
        try {
            const message = await this.messageRepository.findOne({
                where: { id: messageId },
                relations: ['sender', 'conversation']
            });
            if (!message) {
                throw new Error('Message non trouvé');
            }
            if (message.sender_id !== currentUserId && currentUserRole !== 'admin') {
                throw new Error('Vous ne pouvez modifier que vos propres messages');
            }
            await this.messageRepository.update(messageId, {
                content: newContent,
                updated_at: new Date()
            });
            console.log(`✅ Message ${messageId} mis à jour par l'utilisateur ${currentUserId}`);
            return await this.messageRepository.findOne({
                where: { id: messageId },
                relations: ['sender', 'conversation']
            });
        }
        catch (error) {
            console.error('❌ Erreur lors de la mise à jour du message:', error);
            throw error;
        }
    }
    async deleteMessage(messageId, currentUserId, currentUserRole) {
        console.log(`🔍 Utilisateur ${currentUserId} (${currentUserRole}) supprime le message ${messageId}`);
        try {
            const message = await this.messageRepository.findOne({
                where: { id: messageId },
                relations: ['sender', 'conversation']
            });
            if (!message) {
                throw new Error('Message non trouvé');
            }
            if (message.sender_id !== currentUserId && currentUserRole !== 'admin') {
                throw new Error('Vous ne pouvez supprimer que vos propres messages');
            }
            await this.messageRepository.delete(messageId);
            console.log(`✅ Message ${messageId} supprimé par l'utilisateur ${currentUserId}`);
            return { success: true, message: 'Message supprimé avec succès' };
        }
        catch (error) {
            console.error('❌ Erreur lors de la suppression du message:', error);
            throw error;
        }
    }
    async updateConversation(conversationId, updateData, adminId) {
        console.log(`🔍 Admin ${adminId} met à jour la conversation ${conversationId} avec:`, updateData);
        try {
            const conversation = await this.conversationRepository.findOne({
                where: { id: conversationId }
            });
            if (!conversation) {
                throw new Error('Conversation non trouvée');
            }
            const updateFields = {
                updated_at: new Date()
            };
            if (updateData.title) {
                updateFields.title = updateData.title;
            }
            await this.conversationRepository.update(conversationId, updateFields);
            console.log(`✅ Conversation ${conversationId} mise à jour par l'admin ${adminId}`);
            return await this.conversationRepository.findOne({
                where: { id: conversationId },
                relations: ['participants', 'messages']
            });
        }
        catch (error) {
            console.error('❌ Erreur lors de la mise à jour de la conversation:', error);
            throw error;
        }
    }
    async deleteConversation(conversationId, adminId) {
        console.log(`🔍 Admin ${adminId} supprime la conversation ${conversationId}`);
        try {
            const conversation = await this.conversationRepository.findOne({
                where: { id: conversationId }
            });
            if (!conversation) {
                throw new Error('Conversation non trouvée');
            }
            await this.messageRepository.delete({ conversation_id: conversationId });
            await this.conversationRepository.delete(conversationId);
            console.log(`✅ Conversation ${conversationId} supprimée par l'admin ${adminId}`);
            return { success: true, message: 'Conversation supprimée avec succès' };
        }
        catch (error) {
            console.error('❌ Erreur lors de la suppression de la conversation:', error);
            throw error;
        }
    }
    async createOrGetConversation(currentUserId, currentUserRole, recipientId) {
        console.log(`🔍 createOrGetConversation - currentUserId: ${currentUserId}, currentUserRole: ${currentUserRole}, recipientId: ${recipientId} (type: ${typeof recipientId})`);
        if (currentUserId === recipientId) {
            throw new Error('Vous ne pouvez pas vous envoyer un message à vous-même');
        }
        const availableRecipients = await this.getAvailableRecipients(currentUserId, currentUserRole);
        console.log(`🔍 availableRecipients:`, availableRecipients.map(r => ({ id: r.id, name: `${r.firstName} ${r.lastName}`, role: r.role })));
        const recipient = availableRecipients.find(r => r.id === recipientId);
        console.log(`🔍 recipient trouvé:`, recipient ? `${recipient.firstName} ${recipient.lastName} (ID: ${recipient.id})` : 'AUCUN');
        if (!recipient) {
            console.log(`❌ Destinataire non autorisé - recipientId: ${recipientId}, IDs disponibles:`, availableRecipients.map(r => r.id));
            throw new Error('Destinataire non autorisé');
        }
        const existingConversation = await this.conversationRepository.findOne({
            where: [
                { participant1_id: currentUserId, participant2_id: recipientId },
                { participant1_id: recipientId, participant2_id: currentUserId }
            ]
        });
        if (existingConversation) {
            const response = {
                conversation: {
                    ...existingConversation,
                    participant1_id: currentUserId,
                    participant2_id: recipientId
                },
                isNew: false
            };
            console.log('🔍 Returning existing conversation response:', JSON.stringify(response, null, 2));
            return response;
        }
        const newConversation = this.conversationRepository.create({
            groupe_id: null,
            last_message_id: null,
            type: 'direct',
            participant1_id: currentUserId,
            participant2_id: recipientId
        });
        const savedConversation = await this.conversationRepository.save(newConversation);
        const response = {
            conversation: {
                ...savedConversation,
                participant1_id: currentUserId,
                participant2_id: recipientId
            },
            isNew: true
        };
        console.log('🔍 Returning new conversation response:', JSON.stringify(response, null, 2));
        return response;
    }
};
exports.MessagingService = MessagingService;
exports.MessagingService = MessagingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(conversation_entity_1.Conversation)),
    __param(1, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(2, (0, typeorm_1.InjectRepository)(groupe_entity_1.Groupe)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(5, (0, typeorm_1.InjectRepository)(parent_entity_1.Parent)),
    __param(6, (0, typeorm_1.InjectRepository)(parent_student_entity_1.ParentStudent)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        group_service_1.GroupService])
], MessagingService);
//# sourceMappingURL=messaging.service.js.map