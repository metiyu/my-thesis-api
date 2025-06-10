import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class ApiKeyService implements OnModuleInit {
    private readonly DB_PATH = join(process.cwd(), 'api-keys-db.json');
    private keysByEmail: Map<string, string> = new Map();
    private readonly logger = new Logger(ApiKeyService.name);
    private isReady = false;

    async onModuleInit() {
        this.logger.log('[ApiKeyService] Initializing...');
        await this.loadDb();
        this.isReady = true;
        this.logger.log('[ApiKeyService] Ready!');
    }

    async ensureReady(): Promise<void> {
        if (!this.isReady) {
            await this.loadDb();
            this.isReady = true;
        }
    }

    async loadDb(): Promise<void> {
        try {
            await fs.access(this.DB_PATH);
            const data = await fs.readFile(this.DB_PATH, 'utf-8');
            const parsed = JSON.parse(data);
            this.keysByEmail = new Map(Object.entries(parsed));
            this.logger.log(`[ApiKeyService] Loaded ${this.keysByEmail.size} keys from database`);
        } catch (err) {
            if (err.code === 'ENOENT') {
                this.logger.log(`[ApiKeyService] Database file not found, creating new one`);
                this.keysByEmail = new Map();
                await this.saveDb();
            } else {
                this.logger.error(`[ApiKeyService] Error loading database:`, err);
                this.keysByEmail = new Map();
            }
        }
    }

    async saveDb(): Promise<void> {
        try {
            const obj = Object.fromEntries(this.keysByEmail);
            await fs.writeFile(this.DB_PATH, JSON.stringify(obj, null, 2), 'utf-8');
            this.logger.log(`[ApiKeyService] Database saved with ${this.keysByEmail.size} keys`);
        } catch (err) {
            this.logger.error(`[ApiKeyService] Error saving database:`, err);
        }
    }

    async isValidApiKey(apiKey: string): Promise<boolean> {
        await this.ensureReady();
        const isValid = Array.from(this.keysByEmail.values()).includes(apiKey);
        this.logger.log(`[ApiKeyService] Validating API key: ${isValid ? 'VALID' : 'INVALID'}`);
        return isValid;
    }

    async getKeyByEmail(email: string): Promise<string | undefined> {
        await this.ensureReady();
        return this.keysByEmail.get(email);
    }

    async generateOrGetApiKey(email: string): Promise<string> {
        await this.ensureReady();

        const existingKey = this.keysByEmail.get(email);
        if (existingKey) {
            this.logger.log(`[ApiKeyService] Returning existing key for: ${email}`);
            return existingKey;
        }

        const newKey = this.generateRandomKey();
        this.keysByEmail.set(email, newKey);
        await this.saveDb();
        this.logger.log(`[ApiKeyService] Generated new key for: ${email}`);
        return newKey;
    }

    private generateRandomKey(): string {
        return require('crypto').randomBytes(32).toString('hex');
    }

    async getAllKeys(): Promise<Record<string, string>> {
        await this.ensureReady();
        return Object.fromEntries(this.keysByEmail);
    }
}