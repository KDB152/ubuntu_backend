import { MeetingsService } from './meetings.service';
export declare class MeetingsController {
    private readonly meetingsService;
    constructor(meetingsService: MeetingsService);
    getMeetings(req: any, parentId?: string, adminId?: string, status?: string): Promise<import("./entities/meeting.entity").Meeting[]>;
}
