import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class ApiKeyService {
    private readonly DB_PATH = join(
        process.cwd(),
        process.env.NODE_ENV === 'production' ? 'dist' : 'src',
        'api-key',
        'db.json'
    );
    private keysByEmail: Map<string, string> = new Map();
    private readonly logger = new Logger(ApiKeyService.name);

    constructor() {
        this.loadDb();
    }

    /**
     * Load existing keys from db.json into memory
     */
    async loadDb(): Promise<void> {
        try {
            const data = await fs.readFile(this.DB_PATH, 'utf-8');
            const parsed = JSON.parse(data);
            this.keysByEmail = new Map(Object.entries(parsed));
            this.logger.log('[ApiKeyService] Loaded keys from db.json');
        } catch (err) {
            this.logger.error('[ApiKeyService] Failed to load db.json', err);
        }
    }

    /**
     * Save current keys from memory to db.json
     */
    async saveDb(): Promise<void> {
        const obj = Object.fromEntries(this.keysByEmail);
        await fs.writeFile(this.DB_PATH, JSON.stringify(obj, null, 2), 'utf-8');
    }

    /**
     * Check if an API key exists
     */
    isValidApiKey(apiKey: string): boolean {
        return Array.from(this.keysByEmail.values()).includes(apiKey);
    }

    /**
     * Get API key by email
     */
    getKeyByEmail(email: string): string | undefined {
        return this.keysByEmail.get(email);
    }

    /**
     * Generate or retrieve API key for an email
     */
    async generateOrGetApiKey(email: string): Promise<string> {
        const existingKey = this.keysByEmail.get(email);
        if (existingKey) return existingKey;

        const newKey = this.generateRandomKey();
        this.keysByEmail.set(email, newKey);
        await this.saveDb(); // Persist to file
        return newKey;
    }

    /**
     * Generate a random API key
     */
    private generateRandomKey(): string {
        return require('crypto').randomBytes(20).toString('hex');
    }

    /**
     * Get all keys (for debugging)
     */
    getAllKeys(): Record<string, string> {
        return Object.fromEntries(this.keysByEmail);
    }
}