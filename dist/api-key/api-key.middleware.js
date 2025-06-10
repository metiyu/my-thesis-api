"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ApiKeyMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyMiddleware = void 0;
const common_1 = require("@nestjs/common");
const api_key_service_1 = require("./api-key.service");
let ApiKeyMiddleware = ApiKeyMiddleware_1 = class ApiKeyMiddleware {
    constructor(apiKeyService) {
        this.apiKeyService = apiKeyService;
        this.logger = new common_1.Logger(ApiKeyMiddleware_1.name);
        this.logger.log('[ApiKeyMiddleware] Constructor called');
    }
    async use(req, res, next) {
        this.logger.log(`[ApiKeyMiddleware] ===== MIDDLEWARE TRIGGERED =====`);
        this.logger.log(`[ApiKeyMiddleware] ${req.method} ${req.url}`);
        this.logger.log(`[ApiKeyMiddleware] Path: ${req.path}`);
        this.logger.log(`[ApiKeyMiddleware] Headers: ${JSON.stringify(req.headers, null, 2)}`);
        const skipPaths = [
            '/',
            '/auth/get-key-form',
            '/auth/generate-key',
            '/favicon.ico',
        ];
        const isStaticFile = req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/i);
        const currentPath = req.path;
        const shouldSkip = skipPaths.includes(currentPath) || !!isStaticFile;
        this.logger.log(`[ApiKeyMiddleware] Should skip: ${shouldSkip} (Static file: ${!!isStaticFile})`);
        if (shouldSkip) {
            this.logger.log(`[ApiKeyMiddleware] SKIPPING - calling next()`);
            return next();
        }
        this.logger.log(`[ApiKeyMiddleware] CHECKING API KEY...`);
        await this.apiKeyService.ensureReady();
        const apiKeyFromHeader = req.headers['x-api-key'];
        const apiKeyFromCookie = req.cookies?.['x-api-key'];
        const apiKey = apiKeyFromHeader || apiKeyFromCookie;
        this.logger.log(`[ApiKeyMiddleware] API Key found - Header: ${!!apiKeyFromHeader}, Cookie: ${!!apiKeyFromCookie}`);
        this.logger.log(`[ApiKeyMiddleware] Cookies received: ${JSON.stringify(req.cookies)}`);
        if (!apiKey || typeof apiKey !== 'string') {
            this.logger.log('[ApiKeyMiddleware] NO API KEY - REDIRECTING TO FORM');
            return res.redirect('/auth/get-key-form');
        }
        const isValid = await this.apiKeyService.isValidApiKey(apiKey);
        if (!isValid) {
            this.logger.log('[ApiKeyMiddleware] INVALID API KEY - REDIRECTING TO FORM');
            res.clearCookie('x-api-key');
            return res.redirect('/auth/get-key-form');
        }
        this.logger.log('[ApiKeyMiddleware] VALID API KEY - PROCEEDING');
        next();
    }
};
exports.ApiKeyMiddleware = ApiKeyMiddleware;
exports.ApiKeyMiddleware = ApiKeyMiddleware = ApiKeyMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [api_key_service_1.ApiKeyService])
], ApiKeyMiddleware);
//# sourceMappingURL=api-key.middleware.js.map