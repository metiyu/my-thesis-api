"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ApiKeyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
let ApiKeyService = ApiKeyService_1 = class ApiKeyService {
    constructor() {
        this.DB_PATH = (0, path_1.join)(process.cwd(), 'api-keys-db.json');
        this.keysByEmail = new Map();
        this.logger = new common_1.Logger(ApiKeyService_1.name);
        this.isReady = false;
    }
    async onModuleInit() {
        this.logger.log('[ApiKeyService] Initializing...');
        await this.loadDb();
        this.isReady = true;
        this.logger.log('[ApiKeyService] Ready!');
    }
    async ensureReady() {
        if (!this.isReady) {
            await this.loadDb();
            this.isReady = true;
        }
    }
    async loadDb() {
        try {
            await fs_1.promises.access(this.DB_PATH);
            const data = await fs_1.promises.readFile(this.DB_PATH, 'utf-8');
            const parsed = JSON.parse(data);
            this.keysByEmail = new Map(Object.entries(parsed));
            this.logger.log(`[ApiKeyService] Loaded ${this.keysByEmail.size} keys from database`);
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                this.logger.log(`[ApiKeyService] Database file not found, creating new one`);
                this.keysByEmail = new Map();
                await this.saveDb();
            }
            else {
                this.logger.error(`[ApiKeyService] Error loading database:`, err);
                this.keysByEmail = new Map();
            }
        }
    }
    async saveDb() {
        try {
            const obj = Object.fromEntries(this.keysByEmail);
            await fs_1.promises.writeFile(this.DB_PATH, JSON.stringify(obj, null, 2), 'utf-8');
            this.logger.log(`[ApiKeyService] Database saved with ${this.keysByEmail.size} keys`);
        }
        catch (err) {
            this.logger.error(`[ApiKeyService] Error saving database:`, err);
        }
    }
    async isValidApiKey(apiKey) {
        await this.ensureReady();
        const isValid = Array.from(this.keysByEmail.values()).includes(apiKey);
        this.logger.log(`[ApiKeyService] Validating API key: ${isValid ? 'VALID' : 'INVALID'}`);
        return isValid;
    }
    async getKeyByEmail(email) {
        await this.ensureReady();
        return this.keysByEmail.get(email);
    }
    async generateOrGetApiKey(email) {
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
    generateRandomKey() {
        return require('crypto').randomBytes(32).toString('hex');
    }
    async getAllKeys() {
        await this.ensureReady();
        return Object.fromEntries(this.keysByEmail);
    }
};
exports.ApiKeyService = ApiKeyService;
exports.ApiKeyService = ApiKeyService = ApiKeyService_1 = __decorate([
    (0, common_1.Injectable)()
], ApiKeyService);
//# sourceMappingURL=api-key.service.js.map