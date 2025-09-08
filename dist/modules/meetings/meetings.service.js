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
exports.MeetingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const meeting_entity_1 = require("./entities/meeting.entity");
const parent_entity_1 = require("../parents/entities/parent.entity");
let MeetingsService = class MeetingsService {
    constructor(meetingsRepository, parentsRepository) {
        this.meetingsRepository = meetingsRepository;
        this.parentsRepository = parentsRepository;
    }
    async getMeetingsByParentId(parentId, status) {
        const where = { parent_id: parentId };
        if (status) {
            where.status = status;
        }
        return this.meetingsRepository.find({
            where,
            order: { meeting_date: 'DESC' }
        });
    }
    async getMeetingsByAdminId(adminId, status) {
        const where = { admin_id: adminId };
        if (status) {
            where.status = status;
        }
        return this.meetingsRepository.find({
            where,
            order: { meeting_date: 'DESC' }
        });
    }
    async getAllMeetings(status) {
        const where = {};
        if (status) {
            where.status = status;
        }
        return this.meetingsRepository.find({
            where,
            order: { meeting_date: 'DESC' }
        });
    }
    async getParentByUserId(userId) {
        return this.parentsRepository.findOne({
            where: { user_id: userId }
        });
    }
};
exports.MeetingsService = MeetingsService;
exports.MeetingsService = MeetingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(meeting_entity_1.Meeting)),
    __param(1, (0, typeorm_1.InjectRepository)(parent_entity_1.Parent)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MeetingsService);
//# sourceMappingURL=meetings.service.js.map