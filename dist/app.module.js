"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const python_service_1 = require("./python/python.service");
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const portfolio_service_1 = require("./portfolio/portfolio.service");
const portfolio_controller_1 = require("./portfolio/portfolio.controller");
const throttler_1 = require("@nestjs/throttler");
const api_key_module_1 = require("./api-key/api-key.module");
const auth_controller_1 = require("./auth/auth.controller");
const auth_module_1 = require("./auth/auth.module");
const test_controller_1 = require("./test/test.controller");
const test_module_1 = require("./test/test.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            api_key_module_1.ApiKeyModule,
            auth_module_1.AuthModule,
            test_module_1.TestModule,
            throttler_1.ThrottlerModule.forRoot({
                throttlers: [
                    {
                        ttl: 60,
                        limit: 20,
                    },
                ],
            }),
        ],
        controllers: [app_controller_1.AppController, portfolio_controller_1.PortfolioController, auth_controller_1.AuthController, test_controller_1.TestController],
        providers: [
            python_service_1.PythonService,
            app_service_1.AppService,
            portfolio_service_1.PortfolioService
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map