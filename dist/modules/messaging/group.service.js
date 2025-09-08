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
exports.GroupService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const groupe_entity_1 = require("./entities/groupe.entity");
const user_entity_1 = require("../users/entities/user.entity");
const student_entity_1 = require("../students/entities/student.entity");
const parent_entity_1 = require("../parents/entities/parent.entity");
const parent_student_entity_1 = require("../relations/entities/parent-student.entity");
const user_entity_2 = require("../users/entities/user.entity");
let GroupService = class GroupService {
    constructor(groupeRepository, userRepository, studentRepository, parentRepository, parentStudentRepository) {
        this.groupeRepository = groupeRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.parentRepository = parentRepository;
        this.parentStudentRepository = parentStudentRepository;
    }
    async createOrGetClassGroup(classLevel) {
        let groupe = await this.groupeRepository.findOne({
            where: { class_level: classLevel }
        });
        if (!groupe) {
            groupe = this.groupeRepository.create({
                title: `Groupe ${classLevel}`,
                class_level: classLevel
            });
            groupe = await this.groupeRepository.save(groupe);
        }
        return groupe;
    }
    async getUserGroups(userId, userRole) {
        if (userRole === 'admin') {
            return this.groupeRepository.find({
                order: { class_level: 'ASC' }
            });
        }
        else if (userRole === 'student') {
            const user = await this.userRepository.findOne({
                where: { id: userId },
                relations: ['student']
            });
            if (user?.student?.class_level) {
                const groupe = await this.groupeRepository.findOne({
                    where: { class_level: user.student.class_level }
                });
                return groupe ? [groupe] : [];
            }
        }
        return [];
    }
    async getGroupParticipants(groupeId) {
        return [];
    }
    async canSendMessage(senderId, recipientId, senderRole) {
        if (senderId === recipientId) {
            return false;
        }
        const sender = await this.userRepository.findOne({
            where: { id: senderId },
            relations: ['student', 'parent']
        });
        const recipient = await this.userRepository.findOne({
            where: { id: recipientId },
            relations: ['student', 'parent']
        });
        if (!sender || !recipient) {
            return false;
        }
        if (senderRole === 'admin') {
            return recipient.role === 'parent';
        }
        if (senderRole === 'parent') {
            if (recipient.role === 'admin') {
                return true;
            }
            if (recipient.role === 'student') {
                const relation = await this.parentStudentRepository.findOne({
                    where: {
                        parent: { user_id: senderId },
                        student: { user_id: recipientId }
                    }
                });
                return !!relation;
            }
        }
        if (senderRole === 'student') {
            if (recipient.role === 'parent') {
                const relation = await this.parentStudentRepository.findOne({
                    where: {
                        parent: { user_id: recipientId },
                        student: { user_id: senderId }
                    }
                });
                return !!relation;
            }
        }
        return false;
    }
    async getAvailableRecipients(currentUserId, userRole) {
        if (userRole === 'admin') {
            return this.userRepository.find({
                where: { role: user_entity_2.UserRole.PARENT },
                select: ['id', 'firstName', 'lastName', 'email', 'role']
            });
        }
        else if (userRole === 'parent') {
            const user = await this.userRepository.findOne({
                where: { id: currentUserId },
                relations: ['parent']
            });
            if (!user?.parent) {
                return [];
            }
            const admin = await this.userRepository.findOne({
                where: { role: user_entity_2.UserRole.ADMIN },
                select: ['id', 'firstName', 'lastName', 'email', 'role']
            });
            const relations = await this.parentStudentRepository.query(`
        SELECT 
          su.id,
          su.first_name as firstName,
          su.last_name as lastName,
          su.email,
          su.role
        FROM parent_student ps
        JOIN parents p ON ps.parent_id = p.id
        JOIN students s ON ps.student_id = s.id
        JOIN users su ON s.user_id = su.id
        WHERE p.user_id = ?
      `, [currentUserId]);
            const children = relations;
            return admin ? [admin, ...children] : children;
        }
        else if (userRole === 'student') {
            const user = await this.userRepository.findOne({
                where: { id: currentUserId },
                relations: ['student']
            });
            if (!user?.student) {
                return [];
            }
            const relations = await this.parentStudentRepository.query(`
        SELECT 
          pu.id,
          pu.first_name as firstName,
          pu.last_name as lastName,
          pu.email,
          pu.role
        FROM parent_student ps
        JOIN parents p ON ps.parent_id = p.id
        JOIN students s ON ps.student_id = s.id
        JOIN users pu ON p.user_id = pu.id
        WHERE s.user_id = ?
      `, [currentUserId]);
            return relations;
        }
        return [];
    }
};
exports.GroupService = GroupService;
exports.GroupService = GroupService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(groupe_entity_1.Groupe)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(3, (0, typeorm_1.InjectRepository)(parent_entity_1.Parent)),
    __param(4, (0, typeorm_1.InjectRepository)(parent_student_entity_1.ParentStudent)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GroupService);
//# sourceMappingURL=group.service.js.map