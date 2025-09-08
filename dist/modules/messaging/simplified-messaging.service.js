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
exports.SimplifiedMessagingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const conversation_entity_1 = require("./entities/conversation.entity");
const message_entity_1 = require("./entities/message.entity");
const user_entity_1 = require("../users/entities/user.entity");
const student_entity_1 = require("../students/entities/student.entity");
const parent_entity_1 = require("../parents/entities/parent.entity");
const parent_student_entity_1 = require("../relations/entities/parent-student.entity");
let SimplifiedMessagingService = class SimplifiedMessagingService {
    constructor(conversationRepository, messageRepository, userRepository, studentRepository, parentRepository, parentStudentRepository) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.parentRepository = parentRepository;
        this.parentStudentRepository = parentStudentRepository;
    }
    async getConversationsForUser(userId) {
        try {
            console.log(`🔍 Recherche des conversations pour l'utilisateur ${userId}`);
            const user = await this.userRepository.findOne({
                where: { id: userId }
            });
            if (!user) {
                console.log(`❌ Utilisateur ${userId} non trouvé`);
                throw new Error('Utilisateur non trouvé');
            }
            console.log(`✅ Utilisateur trouvé: ${user.firstName} ${user.lastName} (${user.role})`);
            const conversations = [];
            if (user.role === 'student') {
                console.log(`📚 Traitement pour un étudiant`);
                const student = await this.studentRepository.findOne({
                    where: { user_id: userId }
                });
                if (student) {
                    console.log(`✅ Étudiant trouvé: classe ${student.class_level}`);
                    try {
                        const parentRelation = await this.parentStudentRepository.findOne({
                            where: { student_id: student.id },
                            relations: ['parent', 'parent.user']
                        });
                        if (parentRelation && parentRelation.parent) {
                            console.log(`👨‍👩‍👧‍👦 Relation parent trouvée: ${parentRelation.parent.user.firstName} ${parentRelation.parent.user.lastName}`);
                            let parentConversation = await this.conversationRepository.findOne({
                                where: [
                                    { participant1_id: userId, participant2_id: parentRelation.parent.user_id, type: 'direct' },
                                    { participant1_id: parentRelation.parent.user_id, participant2_id: userId, type: 'direct' }
                                ]
                            });
                            if (!parentConversation) {
                                console.log(`🆕 Création de la conversation avec le parent`);
                                parentConversation = await this.createDirectConversation(userId, parentRelation.parent.user_id, `${parentRelation.parent.user.firstName} ${parentRelation.parent.user.lastName}`);
                            }
                            else {
                                const expectedTitle = `${parentRelation.parent.user.firstName} ${parentRelation.parent.user.lastName}`;
                                if (parentConversation.title !== expectedTitle) {
                                    console.log(`🔄 Mise à jour du titre de la conversation parent: ${parentConversation.title} → ${expectedTitle}`);
                                    parentConversation.title = expectedTitle;
                                    await this.conversationRepository.save(parentConversation);
                                }
                            }
                            conversations.push(parentConversation);
                        }
                        else {
                            console.log(`⚠️ Aucune relation parent trouvée pour l'étudiant`);
                        }
                    }
                    catch (error) {
                        console.log(`⚠️ Erreur lors de la recherche du parent:`, error.message);
                    }
                    if (student.class_level) {
                        try {
                            let classConversation = await this.conversationRepository.findOne({
                                where: {
                                    class_level: student.class_level,
                                    type: 'class'
                                }
                            });
                            if (!classConversation) {
                                console.log(`🆕 Création de la conversation de classe: ${student.class_level}`);
                                classConversation = await this.createClassConversation(student.class_level);
                            }
                            conversations.push(classConversation);
                        }
                        catch (error) {
                            console.log(`⚠️ Erreur lors de la création de la conversation de classe:`, error.message);
                        }
                    }
                }
                else {
                    console.log(`⚠️ Aucun profil étudiant trouvé pour l'utilisateur ${userId}`);
                }
            }
            else if (user.role === 'parent') {
                console.log(`👨‍👩‍👧‍👦 Traitement pour un parent`);
                const parent = await this.parentRepository.findOne({
                    where: { user_id: userId }
                });
                if (parent) {
                    console.log(`✅ Parent trouvé`);
                    try {
                        const childRelations = await this.parentStudentRepository.find({
                            where: { parent_id: parent.id },
                            relations: ['student', 'student.user']
                        });
                        if (childRelations && childRelations.length > 0) {
                            console.log(`👶 ${childRelations.length} enfant(s) trouvé(s) pour ce parent`);
                            for (const childRelation of childRelations) {
                                if (childRelation.student) {
                                    console.log(`👶 Enfant: ${childRelation.student.user.firstName} ${childRelation.student.user.lastName}`);
                                    let childConversation = await this.conversationRepository.findOne({
                                        where: [
                                            { participant1_id: userId, participant2_id: childRelation.student.user_id, type: 'direct' },
                                            { participant1_id: childRelation.student.user_id, participant2_id: userId, type: 'direct' }
                                        ]
                                    });
                                    if (!childConversation) {
                                        console.log(`🆕 Création de la conversation avec l'enfant: ${childRelation.student.user.firstName}`);
                                        childConversation = await this.createDirectConversation(userId, childRelation.student.user_id, `${childRelation.student.user.firstName} ${childRelation.student.user.lastName}`);
                                    }
                                    else {
                                        const expectedTitle = `${childRelation.student.user.firstName} ${childRelation.student.user.lastName}`;
                                        if (childConversation.title !== expectedTitle) {
                                            console.log(`🔄 Mise à jour du titre de la conversation: ${childConversation.title} → ${expectedTitle}`);
                                            childConversation.title = expectedTitle;
                                            await this.conversationRepository.save(childConversation);
                                        }
                                    }
                                    conversations.push(childConversation);
                                }
                            }
                        }
                        else {
                            console.log(`⚠️ Aucun enfant trouvé pour ce parent`);
                        }
                    }
                    catch (error) {
                        console.log(`⚠️ Erreur lors de la recherche des enfants:`, error.message);
                    }
                    try {
                        const admin = await this.userRepository.findOne({
                            where: { role: 'admin' }
                        });
                        if (admin) {
                            console.log(`👨‍💼 Admin trouvé: ${admin.firstName} ${admin.lastName}`);
                            let adminConversation = await this.conversationRepository.findOne({
                                where: [
                                    { participant1_id: userId, participant2_id: admin.id, type: 'direct' },
                                    { participant1_id: admin.id, participant2_id: userId, type: 'direct' }
                                ]
                            });
                            if (!adminConversation) {
                                console.log(`🆕 Création de la conversation avec l'admin`);
                                adminConversation = await this.createDirectConversation(userId, admin.id, 'Administrateur');
                            }
                            else {
                                if (adminConversation.title !== 'Administrateur') {
                                    console.log(`🔄 Mise à jour du titre de la conversation admin: ${adminConversation.title} → Administrateur`);
                                    adminConversation.title = 'Administrateur';
                                    await this.conversationRepository.save(adminConversation);
                                }
                            }
                            conversations.push(adminConversation);
                        }
                        else {
                            console.log(`⚠️ Aucun admin trouvé`);
                        }
                    }
                    catch (error) {
                        console.log(`⚠️ Erreur lors de la recherche de l'admin:`, error.message);
                    }
                }
                else {
                    console.log(`⚠️ Aucun profil parent trouvé pour l'utilisateur ${userId}`);
                }
            }
            else if (user.role === 'admin') {
                console.log(`👨‍💼 Traitement pour un admin`);
                const classLevels = [
                    '1ère groupe 1', '1ère groupe 2', '1ère groupe 3',
                    'Terminale groupe 1', 'Terminale groupe 2', 'Terminale groupe 3', 'Terminale groupe 4'
                ];
                console.log(`📚 Création des conversations de classes`);
                for (const classLevel of classLevels) {
                    try {
                        let classConversation = await this.conversationRepository.findOne({
                            where: { class_level: classLevel, type: 'class' }
                        });
                        if (!classConversation) {
                            console.log(`🆕 Création de la conversation de classe: ${classLevel}`);
                            classConversation = await this.createClassConversation(classLevel);
                        }
                        conversations.push(classConversation);
                    }
                    catch (error) {
                        console.log(`⚠️ Erreur lors de la création de la conversation de classe ${classLevel}:`, error.message);
                    }
                }
                try {
                    console.log(`👨‍👩‍👧‍👦 Recherche des parents`);
                    const parents = await this.parentRepository.find({
                        relations: ['user']
                    });
                    console.log(`✅ ${parents.length} parents trouvés`);
                    for (const parent of parents) {
                        try {
                            let parentConversation = await this.conversationRepository.findOne({
                                where: [
                                    { participant1_id: userId, participant2_id: parent.user_id, type: 'direct' },
                                    { participant1_id: parent.user_id, participant2_id: userId, type: 'direct' }
                                ]
                            });
                            if (!parentConversation) {
                                console.log(`🆕 Création de la conversation avec le parent: ${parent.user.firstName} ${parent.user.lastName}`);
                                parentConversation = await this.createDirectConversation(userId, parent.user_id, `${parent.user.firstName} ${parent.user.lastName}`);
                            }
                            else {
                                const expectedTitle = `${parent.user.firstName} ${parent.user.lastName}`;
                                if (parentConversation.title !== expectedTitle) {
                                    console.log(`🔄 Mise à jour du titre de la conversation parent admin: ${parentConversation.title} → ${expectedTitle}`);
                                    parentConversation.title = expectedTitle;
                                    await this.conversationRepository.save(parentConversation);
                                }
                            }
                            conversations.push(parentConversation);
                        }
                        catch (error) {
                            console.log(`⚠️ Erreur lors de la création de la conversation avec le parent ${parent.user.firstName}:`, error.message);
                        }
                    }
                }
                catch (error) {
                    console.log(`⚠️ Erreur lors de la recherche des parents:`, error.message);
                }
            }
            else {
                console.log(`⚠️ Rôle utilisateur non reconnu: ${user.role}`);
            }
            for (const conversation of conversations) {
                try {
                    const lastMessage = await this.messageRepository.findOne({
                        where: { conversation_id: conversation.id },
                        order: { created_at: 'DESC' }
                    });
                    if (lastMessage) {
                        conversation.lastMessage = lastMessage;
                    }
                }
                catch (error) {
                    console.log(`⚠️ Erreur lors de la récupération du dernier message pour la conversation ${conversation.id}:`, error.message);
                }
            }
            console.log(`✅ ${conversations.length} conversations trouvées pour l'utilisateur ${userId}`);
            return conversations;
        }
        catch (error) {
            console.error(`❌ Erreur dans getConversationsForUser pour l'utilisateur ${userId}:`, error);
            throw error;
        }
    }
    async createDirectConversation(user1Id, user2Id, title) {
        const conversation = this.conversationRepository.create({
            type: 'direct',
            title: title,
            participant1_id: user1Id,
            participant2_id: user2Id
        });
        return await this.conversationRepository.save(conversation);
    }
    async createClassConversation(classLevel) {
        const conversation = this.conversationRepository.create({
            type: 'class',
            title: classLevel,
            class_level: classLevel
        });
        return await this.conversationRepository.save(conversation);
    }
    async getMessagesForConversation(conversationId, userId) {
        try {
            console.log(`📨 Récupération des messages pour la conversation ${conversationId} par l'utilisateur ${userId}`);
            const conversation = await this.conversationRepository.findOne({
                where: { id: conversationId },
                relations: ['participant1', 'participant2']
            });
            if (!conversation) {
                console.log(`❌ Conversation ${conversationId} non trouvée`);
                throw new Error('Conversation non trouvée');
            }
            console.log(`✅ Conversation trouvée: ${conversation.id} (type: ${conversation.type})`);
            const hasAccess = await this.checkConversationAccess(conversation, userId);
            if (!hasAccess) {
                console.log(`❌ Accès refusé pour l'utilisateur ${userId} à la conversation ${conversationId}`);
                throw new Error('Accès non autorisé à cette conversation');
            }
            console.log(`✅ Accès autorisé pour l'utilisateur ${userId}`);
            const messages = await this.messageRepository.find({
                where: { conversation_id: conversationId },
                relations: ['sender'],
                order: { created_at: 'ASC' }
            });
            console.log(`✅ ${messages.length} messages récupérés pour la conversation ${conversationId}`);
            return messages;
        }
        catch (error) {
            console.error(`❌ Erreur lors de la récupération des messages pour la conversation ${conversationId}:`, error);
            throw error;
        }
    }
    async checkConversationAccess(conversation, userId) {
        console.log(`🔍 Vérification d'accès pour l'utilisateur ${userId} à la conversation ${conversation.id} (type: ${conversation.type})`);
        if (conversation.type === 'direct') {
            const hasAccess = conversation.participant1_id === userId || conversation.participant2_id === userId;
            console.log(`💬 Conversation directe - Accès: ${hasAccess} (participant1: ${conversation.participant1_id}, participant2: ${conversation.participant2_id})`);
            return hasAccess;
        }
        else if (conversation.type === 'class') {
            try {
                const user = await this.userRepository.findOne({
                    where: { id: userId },
                    relations: ['student', 'parent']
                });
                if (!user) {
                    console.log(`❌ Utilisateur ${userId} non trouvé`);
                    return false;
                }
                let userClassLevel = null;
                if (user.role === 'student' && user.student) {
                    userClassLevel = user.student.class_level;
                }
                else if (user.role === 'parent' && user.parent) {
                    const children = await this.studentRepository.find({
                        where: { parent_id: user.parent.id },
                        relations: ['user']
                    });
                    userClassLevel = children.length > 0 ? children[0].class_level : null;
                }
                else if (user.role === 'admin') {
                    console.log(`👑 Admin - Accès autorisé à toutes les conversations de classe`);
                    return true;
                }
                const hasAccess = userClassLevel === conversation.class_level;
                console.log(`👥 Conversation de classe ${conversation.class_level} - Utilisateur classe: ${userClassLevel} - Accès: ${hasAccess}`);
                return hasAccess;
            }
            catch (error) {
                console.error(`❌ Erreur lors de la vérification d'accès pour la conversation de classe:`, error);
                return false;
            }
        }
        else if (conversation.type === 'group') {
            const hasAccess = conversation.participant1_id === userId || conversation.participant2_id === userId;
            console.log(`👥 Conversation de groupe - Accès: ${hasAccess} (participant1: ${conversation.participant1_id}, participant2: ${conversation.participant2_id})`);
            return hasAccess;
        }
        console.log(`❌ Type de conversation non reconnu: ${conversation.type}`);
        return false;
    }
    async sendMessage(conversationId, senderId, content, messageType = 'text', filePath, fileName, fileType) {
        const conversation = await this.conversationRepository.findOne({
            where: { id: conversationId }
        });
        if (!conversation) {
            throw new Error('Conversation non trouvée');
        }
        const hasAccess = await this.checkConversationAccess(conversation, senderId);
        if (!hasAccess) {
            throw new Error('Accès non autorisé à cette conversation');
        }
        let recipientId = null;
        if (conversation.type === 'direct') {
            recipientId = conversation.participant1_id === senderId ?
                conversation.participant2_id : conversation.participant1_id;
        }
        const message = this.messageRepository.create({
            conversation_id: conversationId,
            sender_id: senderId,
            recipient_id: recipientId,
            content: content,
            message_type: messageType,
            file_path: filePath || null
        });
        const savedMessage = await this.messageRepository.save(message);
        console.log(`✅ Message sauvegardé:`, {
            id: savedMessage.id,
            type: messageType,
            filePath: filePath,
            fileName: fileName
        });
        await this.conversationRepository.update(conversationId, {
            last_message_id: savedMessage.id,
            updated_at: new Date()
        });
        return savedMessage;
    }
    async updateMessage(messageId, newContent, currentUserId, currentUserRole) {
        const message = await this.messageRepository.findOne({
            where: { id: messageId },
            relations: ['sender']
        });
        if (!message) {
            throw new Error('Message non trouvé');
        }
        if (message.sender_id !== currentUserId && currentUserRole !== 'admin') {
            throw new Error('Permission insuffisante pour modifier ce message');
        }
        await this.messageRepository.update(messageId, {
            content: newContent,
            updated_at: new Date()
        });
        return await this.messageRepository.findOne({
            where: { id: messageId },
            relations: ['sender']
        });
    }
    async deleteMessage(messageId, currentUserId, currentUserRole) {
        const message = await this.messageRepository.findOne({
            where: { id: messageId },
            relations: ['sender']
        });
        if (!message) {
            throw new Error('Message non trouvé');
        }
        if (message.sender_id !== currentUserId && currentUserRole !== 'admin') {
            throw new Error('Permission insuffisante pour supprimer ce message');
        }
        await this.messageRepository.delete(messageId);
        return { success: true };
    }
    async updateConversation(conversationId, updateData, adminId) {
        const conversation = await this.conversationRepository.findOne({
            where: { id: conversationId }
        });
        if (!conversation) {
            throw new Error('Conversation non trouvée');
        }
        const admin = await this.userRepository.findOne({
            where: { id: adminId, role: 'admin' }
        });
        if (!admin) {
            throw new Error('Seul l\'administrateur peut modifier les conversations');
        }
        await this.conversationRepository.update(conversationId, {
            ...updateData,
            updated_at: new Date()
        });
        return await this.conversationRepository.findOne({
            where: { id: conversationId },
            relations: ['participant1', 'participant2']
        });
    }
    async deleteConversation(conversationId, adminId) {
        const conversation = await this.conversationRepository.findOne({
            where: { id: conversationId }
        });
        if (!conversation) {
            throw new Error('Conversation non trouvée');
        }
        const admin = await this.userRepository.findOne({
            where: { id: adminId, role: 'admin' }
        });
        if (!admin) {
            throw new Error('Seul l\'administrateur peut supprimer les conversations');
        }
        await this.messageRepository.delete({ conversation_id: conversationId });
        await this.conversationRepository.delete(conversationId);
        return { success: true };
    }
    async getMessage(messageId) {
        try {
            const message = await this.messageRepository.findOne({
                where: { id: messageId },
                relations: ['sender']
            });
            if (!message) {
                throw new Error('Message non trouvé');
            }
            if (!message.recipient_id && message.conversation_id) {
                const conversation = await this.conversationRepository.findOne({
                    where: { id: message.conversation_id }
                });
                if (conversation && conversation.type === 'direct') {
                    const recipientId = conversation.participant1_id === message.sender_id ?
                        conversation.participant2_id : conversation.participant1_id;
                    console.log(`🔧 Correction du recipient_id pour le message ${messageId}: ${recipientId}`);
                    await this.messageRepository.update(messageId, { recipient_id: recipientId });
                    message.recipient_id = recipientId;
                }
            }
            return message;
        }
        catch (error) {
            console.error(`❌ Erreur lors de la récupération du message ${messageId}:`, error);
            throw error;
        }
    }
    async getConversation(conversationId) {
        try {
            const conversation = await this.conversationRepository.findOne({
                where: { id: conversationId },
                relations: ['participant1', 'participant2']
            });
            if (!conversation) {
                throw new Error('Conversation non trouvée');
            }
            return conversation;
        }
        catch (error) {
            console.error(`❌ Erreur lors de la récupération de la conversation ${conversationId}:`, error);
            throw error;
        }
    }
    async uploadFile(file, userId) {
        const fs = require('fs');
        const path = require('path');
        console.log(`📤 Upload de fichier: ${file.originalname} par l'utilisateur ${userId}`);
        const uploadsDir = path.join(process.cwd(), 'uploads', 'messages');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
            console.log(`📁 Dossier créé: ${uploadsDir}`);
        }
        const fileExtension = path.extname(file.originalname);
        const fileName = path.basename(file.originalname, fileExtension);
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const storedName = `message-${timestamp}-${randomSuffix}-${fileName}${fileExtension}`;
        const filePath = path.join('uploads', 'messages', storedName);
        const fullPath = path.join(process.cwd(), filePath);
        fs.writeFileSync(fullPath, file.buffer);
        console.log(`✅ Fichier de message sauvegardé: ${fullPath}`);
        return {
            fileName: file.originalname,
            storedName,
            filePath,
            fileType: file.mimetype,
            fileSize: file.size
        };
    }
};
exports.SimplifiedMessagingService = SimplifiedMessagingService;
exports.SimplifiedMessagingService = SimplifiedMessagingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(conversation_entity_1.Conversation)),
    __param(1, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(4, (0, typeorm_1.InjectRepository)(parent_entity_1.Parent)),
    __param(5, (0, typeorm_1.InjectRepository)(parent_student_entity_1.ParentStudent)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SimplifiedMessagingService);
//# sourceMappingURL=simplified-messaging.service.js.map