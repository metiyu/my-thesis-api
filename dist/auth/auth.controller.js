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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const api_key_service_1 = require("../api-key/api-key.service");
let AuthController = AuthController_1 = class AuthController {
    constructor(apiKeyService) {
        this.apiKeyService = apiKeyService;
        this.logger = new common_1.Logger(AuthController_1.name);
    }
    async generateKey(email, res) {
        this.logger.log(`[AuthController] Generate key request for email: ${email}`);
        if (!email || !this.isValidEmail(email)) {
            this.logger.log(`[AuthController] Invalid email provided: ${email}`);
            return res.status(common_1.HttpStatus.BAD_REQUEST).send('Invalid or missing email');
        }
        try {
            const apiKey = await this.apiKeyService.generateOrGetApiKey(email);
            res.cookie('x-api-key', apiKey, {
                maxAge: 1000 * 60 * 60 * 24 * 7,
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            });
            this.logger.log(`[AuthController] API key set in cookie, redirecting to /api`);
            return res.redirect('/api');
        }
        catch (error) {
            this.logger.error('[AuthController] Error generating API key:', error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).send('Failed to generate API key');
        }
    }
    getKeyForm(req, res) {
        const apiKeyFromHeader = req.headers['x-api-key'];
        const apiKeyFromCookie = req.cookies?.['x-api-key'];
        const apiKey = apiKeyFromHeader || apiKeyFromCookie;
        if (apiKey) {
            this.logger.log('[AuthController] User already has API key, redirecting to /api');
            return res.redirect('/api');
        }
        this.logger.log('[AuthController] Serving API key form');
        return res.sendFile('api-key-form.html', { root: 'public' });
    }
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('generate-key'),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generateKey", null);
__decorate([
    (0, common_1.Get)('get-key-form'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getKeyForm", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [api_key_service_1.ApiKeyService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map