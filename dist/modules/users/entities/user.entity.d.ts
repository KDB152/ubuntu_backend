export declare enum UserRole {
    STUDENT = "student",
    PARENT = "parent",
    TEACHER = "teacher",
    ADMIN = "admin"
}
export declare class User {
    id: number;
    email: string;
    password_hash: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
    is_active: boolean;
    is_approved: boolean;
    email_verified: boolean;
    verification_token: string | null;
    verification_token_expiry: Date | null;
    email_verification_code: string | null;
    email_verification_code_expiry: Date | null;
    password_reset_token: string | null;
    password_reset_token_expiry: Date | null;
    password_reset_code: string | null;
    password_reset_code_expiry: Date | null;
    last_login: Date | null;
    created_at: Date;
    updated_at: Date;
    student: any;
    parent: any;
    resetPasswordToken: string;
    resetPasswordExpiry: Date;
}
