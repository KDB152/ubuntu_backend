"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const admin_controller_1 = require("./admin.controller");
const users_module_1 = require("../users/users.module");
const students_module_1 = require("../students/students.module");
const parents_module_1 = require("../parents/parents.module");
const admin_service_1 = require("./admin.service");
const payments_service_1 = require("./payments.service");
const payment_entity_1 = require("./entities/payment.entity");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([payment_entity_1.Payment]),
            users_module_1.UsersModule,
            students_module_1.StudentsModule,
            parents_module_1.ParentsModule
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService, payments_service_1.PaymentsService],
        exports: [payments_service_1.PaymentsService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map