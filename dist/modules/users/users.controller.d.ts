import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(role?: string): Promise<import("./entities/user.entity").User[]>;
    debugAllUsers(): Promise<import("./entities/user.entity").User[]>;
    findOne(id: string): Promise<import("./entities/user.entity").User>;
    updateUser(id: string, updateData: any): Promise<import("./entities/user.entity").User>;
}
