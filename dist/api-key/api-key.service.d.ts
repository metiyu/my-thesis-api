import { OnModuleInit } from '@nestjs/common';
export declare class ApiKeyService implements OnModuleInit {
    private readonly DB_PATH;
    private keysByEmail;
    private readonly logger;
    private isReady;
    onModuleInit(): Promise<void>;
    ensureReady(): Promise<void>;
    loadDb(): Promise<void>;
    saveDb(): Promise<void>;
    isValidApiKey(apiKey: string): Promise<boolean>;
    getKeyByEmail(email: string): Promise<string | undefined>;
    generateOrGetApiKey(email: string): Promise<string>;
    private generateRandomKey;
    getAllKeys(): Promise<Record<string, string>>;
}
