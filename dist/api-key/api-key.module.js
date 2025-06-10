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
var ApiKeyModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyModule = void 0;
const common_1 = require("@nestjs/common");
const api_key_middleware_1 = require("./api-key.middleware");
const api_key_service_1 = require("./api-key.service");
let ApiKeyModule = ApiKeyModule_1 = class ApiKeyModule {
    constructor() {
        this.logger = new common_1.Logger(ApiKeyModule_1.name);
        this.logger.log('[ApiKeyModule] Constructor called');
    }
    configure(consumer) {
        this.logger.log('[ApiKeyModule] Configuring middleware...');
        consumer
            .apply(api_key_middleware_1.ApiKeyMiddleware)
            .forRoutes({ path: '*', method: common_1.RequestMethod.ALL });
        this.logger.log('[ApiKeyModule] Middleware configured for all routes');
    }
};
exports.ApiKeyModule = ApiKeyModule;
exports.ApiKeyModule = ApiKeyModule = ApiKeyModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [api_key_service_1.ApiKeyService],
        exports: [api_key_service_1.ApiKeyService],
    }),
    __metadata("design:paramtypes", [])
], ApiKeyModule);
//# sourceMappingURL=api-key.module.js.map