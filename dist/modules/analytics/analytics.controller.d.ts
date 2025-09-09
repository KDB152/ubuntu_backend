export declare class AnalyticsController {
    constructor();
    getDashboardAnalytics(req: any): Promise<{
        totalUsers: number;
        totalStudents: number;
        totalParents: number;
        totalFiles: number;
        recentActivity: any[];
        charts: {
            userGrowth: any[];
            fileUploads: any[];
            activityByMonth: any[];
        };
    }>;
}
