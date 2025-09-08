import { Controller, Get, Param, Query, Put, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserRole } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query('role') role?: string) {
    if (role) {
      return this.usersService.findByRole(role);
    }
    return this.usersService.findAll();
  }

  @Get('debug/all')
  async debugAllUsers() {
    console.log('🔍 Debug: Listing all users with their IDs');
    const users = await this.usersService.findAll();
    console.log('🔍 All users:', users.map(u => ({ id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email })));
    return users;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(parseInt(id));
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateData: any) {
    console.log('🔍 PUT /users/:id called with id:', id, 'and data:', updateData);
    
    try {
      const userId = parseInt(id);
      if (isNaN(userId)) {
        console.error('🔍 Invalid user ID:', id);
        throw new Error('ID utilisateur invalide');
      }

      // Préparer les données de mise à jour
      const userUpdateData: any = {
        // Champs User
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        email: updateData.email,
        phone: updateData.phone_number || updateData.phone,
        is_active: updateData.isActive,
        is_approved: updateData.isApproved,
        email_verified: updateData.email_verified,
        last_login: updateData.last_login,
      };

      // Ajouter les champs Student essentiels
      if (updateData.role === UserRole.STUDENT) {
        userUpdateData.class_level = updateData.classLevel || updateData.class;
        userUpdateData.birth_date = updateData.birthDate || updateData.birth_date;
      }
      
      // Ajouter TOUS les champs Parent
      if (updateData.role === UserRole.PARENT) {
        userUpdateData.parent_phone_number = updateData.phone_number || updateData.phone;
        userUpdateData.parent_address = updateData.address;
        userUpdateData.occupation = updateData.occupation;
      }

      console.log('🔍 Updating user with data:', userUpdateData);
      
      const result = await this.usersService.update(userId, userUpdateData);
      console.log('🔍 User updated successfully:', result);
      return result;
    } catch (error) {
      console.error('🔍 Error updating user:', error);
      console.error('🔍 Error stack:', error.stack);
      console.error('🔍 Error message:', error.message);
      throw error;
    }
  }
}