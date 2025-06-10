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
var TestController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
const common_1 = require("@nestjs/common");
let TestController = TestController_1 = class TestController {
    constructor() {
        this.logger = new common_1.Logger(TestController_1.name);
    }
    getTest() {
        this.logger.log('[TestController] Test endpoint accessed');
        return { message: 'Test endpoint working', timestamp: new Date().toISOString() };
    }
    getProtectedTest() {
        this.logger.log('[TestController] Protected test endpoint accessed');
        return { message: 'Protected endpoint working', timestamp: new Date().toISOString() };
    }
};
exports.TestController = TestController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestController.prototype, "getTest", null);
__decorate([
    (0, common_1.Get)('protected'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestController.prototype, "getProtectedTest", null);
exports.TestController = TestController = TestController_1 = __decorate([
    (0, common_1.Controller)('test')
], TestController);
//# sourceMappingURL=test.controller.js.map