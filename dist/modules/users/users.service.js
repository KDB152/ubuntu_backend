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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const students_service_1 = require("../students/students.service");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(usersRepository, studentsService) {
        this.usersRepository = usersRepository;
        this.studentsService = studentsService;
    }
    async createUser(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = this.usersRepository.create({
            email: data.email,
            password_hash: hashedPassword,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            role: data.role ?? user_entity_1.UserRole.STUDENT,
            is_active: data.is_active ?? true,
            is_approved: data.is_approved ?? false,
        });
        return this.usersRepository.save(user);
    }
    async findByEmail(email) {
        return this.usersRepository.findOne({ where: { email } });
    }
    async findAll() {
        return this.usersRepository.find();
    }
    async findById(id) {
        const user = await this.usersRepository.findOne({
            where: { id }
        });
        console.log('🔍 findById result for user', id, ':', user);
        return user;
    }
    async findByRole(role) {
        return this.usersRepository.find({
            where: { role: role },
            select: ['id', 'firstName', 'lastName', 'email', 'role']
        });
    }
    async update(id, data) {
        console.log('🔍 UsersService.update called with id:', id, 'and data:', data);
        try {
            const allUsers = await this.usersRepository.find({ select: ['id', 'firstName', 'lastName', 'email'] });
            console.log('🔍 All users in database:', allUsers);
            if (!id || isNaN(id)) {
                throw new Error(`ID utilisateur invalide: ${id}`);
            }
            let existingUser = await this.usersRepository.findOne({ where: { id } });
            if (!existingUser) {
                console.error('🔍 User not found with id:', id);
                console.error('🔍 Available user IDs:', allUsers.map(u => u.id));
                console.error('🔍 Available users:', allUsers.map(u => ({ id: u.id, email: u.email, name: `${u.firstName} ${u.lastName}` })));
                const availableUsers = allUsers.map(u => `ID: ${u.id} - ${u.email} (${u.firstName} ${u.lastName})`).join('\n');
                throw new Error(`Utilisateur avec l'ID ${id} non trouvé.\n\nUtilisateurs disponibles:\n${availableUsers}`);
            }
            console.log('🔍 Existing user found:', existingUser);
            if (data.email && data.email !== existingUser.email) {
                console.log('🔍 Email is being changed, checking uniqueness...');
                const emailExists = await this.usersRepository.findOne({
                    where: { email: data.email }
                });
                if (emailExists && emailExists.id !== id) {
                    throw new Error(`L'email "${data.email}" est déjà utilisé par un autre utilisateur.`);
                }
                console.log('🔍 Email is unique, proceeding with update...');
            }
            const userData = {};
            const studentData = {};
            const parentData = {};
            if (data.firstName !== undefined)
                userData.firstName = data.firstName;
            if (data.lastName !== undefined)
                userData.lastName = data.lastName;
            if (data.email !== undefined)
                userData.email = data.email;
            if (data.phone !== undefined) {
                userData.phone = data.phone;
                console.log('🔍 Phone field mapped:', data.phone);
            }
            if (data.is_active !== undefined)
                userData.is_active = data.is_active;
            if (data.is_approved !== undefined)
                userData.is_approved = data.is_approved;
            if (data.email_verified !== undefined)
                userData.email_verified = data.email_verified;
            if (data.last_login !== undefined)
                userData.last_login = data.last_login;
            if (data.classLevel !== undefined)
                studentData.class_level = data.classLevel;
            if (data.birthDate !== undefined) {
                studentData.birth_date = new Date(data.birthDate);
                console.log('🔍 Birth date mapped:', data.birthDate);
            }
            if (data.phone_number !== undefined)
                parentData.phone_number = data.phone_number;
            if (data.address !== undefined)
                parentData.address = data.address;
            if (data.occupation !== undefined)
                parentData.occupation = data.occupation;
            console.log('🔍 Original data keys:', Object.keys(data));
            console.log('🔍 Mapped userData keys:', Object.keys(userData));
            console.log('🔍 Mapped studentData keys:', Object.keys(studentData));
            console.log('🔍 Mapped parentData keys:', Object.keys(parentData));
            console.log('🔍 User data to update:', userData);
            console.log('🔍 Student data to update:', studentData);
            console.log('🔍 Parent data to update:', parentData);
            if (Object.keys(userData).length > 0) {
                console.log('🔍 Updating User entity with data:', userData);
                const userUpdateResult = await this.usersRepository.update(id, userData);
                console.log('🔍 User update result:', userUpdateResult);
            }
            else {
                console.log('🔍 No User data to update');
            }
            if (Object.keys(studentData).length > 0) {
                console.log('🔍 Updating Student entity with data:', studentData);
                try {
                    const student = await this.studentsService.findByUserId(id);
                    if (student) {
                        await this.studentsService.update(student.id, studentData);
                        console.log('🔍 Student updated successfully');
                    }
                    else {
                        console.log('🔍 No student found for user ID:', id);
                    }
                }
                catch (error) {
                    console.error('🔍 Error updating student:', error);
                }
            }
            if (Object.keys(parentData).length > 0) {
                console.log('🔍 Parent entity update not implemented yet');
            }
            const updatedUser = await this.findById(id);
            console.log('🔍 Final updated user:', updatedUser);
            return updatedUser;
        }
        catch (error) {
            console.error('🔍 Error in UsersService.update:', error);
            console.error('🔍 Error stack:', error.stack);
            throw error;
        }
    }
    async remove(id) {
        await this.usersRepository.delete(id);
        return { success: true };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        students_service_1.StudentsService])
], UsersService);
//# sourceMappingURL=users.service.js.map