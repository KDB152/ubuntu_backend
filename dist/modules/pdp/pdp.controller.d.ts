import { Response } from 'express';
import { PdpService } from './pdp.service';
export declare class PdpController {
    private readonly pdpService;
    constructor(pdpService: PdpService);
    uploadProfilePicture(req: any, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            fileName: string;
            fileType: "JPEG" | "PNG" | "SVG" | "GIF" | "WebP";
            fileSize: number;
            url: string;
        };
    }>;
    getMyProfilePicture(req: any): Promise<{
        success: boolean;
        message: string;
        data: any;
    } | {
        success: boolean;
        data: {
            id: number;
            fileName: string;
            fileType: "JPEG" | "PNG" | "SVG" | "GIF" | "WebP";
            fileSize: number;
            url: string;
            createdAt: Date;
        };
        message?: undefined;
    }>;
    getUserProfilePicture(userId: number): Promise<{
        success: boolean;
        message: string;
        data: any;
    } | {
        success: boolean;
        data: {
            id: number;
            fileName: string;
            fileType: "JPEG" | "PNG" | "SVG" | "GIF" | "WebP";
            fileSize: number;
            url: string;
            createdAt: Date;
        };
        message?: undefined;
    }>;
    serveProfilePicture(userId: number, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteMyProfilePicture(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
