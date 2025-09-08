"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const messaging_controller_1 = require("./messaging.controller");
const messaging_service_1 = require("./messaging.service");
const simplified_messaging_service_1 = require("./simplified-messaging.service");
const group_service_1 = require("./group.service");
const conversation_entity_1 = require("./entities/conversation.entity");
const message_entity_1 = require("./entities/message.entity");
const groupe_entity_1 = require("./entities/groupe.entity");
const user_entity_1 = require("../users/entities/user.entity");
const student_entity_1 = require("../students/entities/student.entity");
const parent_entity_1 = require("../parents/entities/parent.entity");
const parent_student_entity_1 = require("../relations/entities/parent-student.entity");
let MessagingModule = class MessagingModule {
};
exports.MessagingModule = MessagingModule;
exports.MessagingModule = MessagingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                conversation_entity_1.Conversation,
                message_entity_1.Message,
                groupe_entity_1.Groupe,
                user_entity_1.User,
                student_entity_1.Student,
                parent_entity_1.Parent,
                parent_student_entity_1.ParentStudent
            ]),
        ],
        controllers: [messaging_controller_1.MessagingController],
        providers: [messaging_service_1.MessagingService, simplified_messaging_service_1.SimplifiedMessagingService, group_service_1.GroupService],
        exports: [messaging_service_1.MessagingService, simplified_messaging_service_1.SimplifiedMessagingService, group_service_1.GroupService],
    })
], MessagingModule);
//# sourceMappingURL=messaging.module.js.map