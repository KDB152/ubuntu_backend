export declare class NotificationsController {
    constructor();
    getUserNotifications(userId: string, req: any): Promise<{
        notifications: any[];
        unreadCount: number;
    }>;
}
