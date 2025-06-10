import { Request, Response } from 'express';
import { ApiKeyService } from 'src/api-key/api-key.service';
export declare class AuthController {
    private readonly apiKeyService;
    private readonly logger;
    constructor(apiKeyService: ApiKeyService);
    generateKey(email: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
    getKeyForm(req: Request, res: Response): void;
    private isValidEmail;
}
