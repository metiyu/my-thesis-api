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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioService = void 0;
const common_1 = require("@nestjs/common");
const python_service_1 = require("../python/python.service");
let PortfolioService = class PortfolioService {
    constructor(pythonService) {
        this.pythonService = pythonService;
    }
    async downloadData(dto) {
        return this.pythonService.executePythonScript('download_data.py', [dto]);
    }
    async analyzeIndividualStocks(dto) {
        return this.pythonService.executePythonScript('analyze_individual_stocks.py', [dto]);
    }
    async optimizePortfolio(dto) {
        return this.pythonService.executePythonScript('optimize_portfolio.py', [dto]);
    }
    async generateEfficientFrontier(dto) {
        return this.pythonService.executePythonScript('generate_efficient_frontier.py', [dto]);
    }
    async monteCarloSimulation(dto) {
        return this.pythonService.executePythonScript('monte_carlo_simulation.py', [dto]);
    }
    async performStatisticalTest(dto) {
        return this.pythonService.executePythonScript('statistical_test.py', [dto]);
    }
    async analyzeExtremeCases(dto) {
        return this.pythonService.executePythonScript('analyze_extreme_cases.py', [dto]);
    }
    async compareWithBenchmark(dto) {
        return this.pythonService.executePythonScript('compare_benchmark.py', [dto]);
    }
};
exports.PortfolioService = PortfolioService;
exports.PortfolioService = PortfolioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [python_service_1.PythonService])
], PortfolioService);
//# sourceMappingURL=portfolio.service.js.map