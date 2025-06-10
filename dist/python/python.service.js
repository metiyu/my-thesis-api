"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PythonService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PythonService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const path = require("path");
const fs = require("fs");
let PythonService = PythonService_1 = class PythonService {
    constructor() {
        this.logger = new common_1.Logger(PythonService_1.name);
    }
    async executePythonScript(script, args) {
        return new Promise((resolve, reject) => {
            const scriptPath = path.resolve(process.cwd(), 'scripts', 'new', script);
            const pythonExec = 'python3';
            const tempDir = path.resolve(process.cwd(), 'temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir);
            }
            const tempFile = path.resolve(tempDir, `${Date.now()}_input.json`);
            fs.writeFileSync(tempFile, JSON.stringify(args[0]));
            this.logger.log(`Running Python: ${pythonExec} ${scriptPath} with ${tempFile}`);
            const py = (0, child_process_1.spawn)(pythonExec, [scriptPath, tempFile], {
                cwd: process.cwd(),
                stdio: ['ignore', 'pipe', 'pipe'],
                env: process.env,
            });
            let stdout = '';
            let stderr = '';
            py.stdout.on('data', (data) => {
                stdout += data.toString('utf8');
            });
            py.stderr.on('data', (data) => {
                stderr += data.toString('utf8');
            });
            py.on('close', (code) => {
                if (fs.existsSync(tempFile))
                    fs.unlinkSync(tempFile);
                if (code !== 0) {
                    this.logger.error(`[Python] Exit Code: ${code}`);
                    this.logger.error(`[Python] STDERR: ${stderr}`);
                    this.logger.error(`[Python] STDOUT: ${stdout}`);
                    return reject({
                        message: `Python exited with code ${code}`,
                        error: stderr || 'No stderr output',
                    });
                }
                try {
                    const cleanOutput = this.extractJson(stdout);
                    return resolve(JSON.parse(cleanOutput));
                }
                catch (err) {
                    this.logger.error('[Python] JSON Parse Failed');
                    this.logger.error('[Python] Raw Output:', stdout);
                    this.logger.error('[Python] Stderr:', stderr);
                    return reject({
                        message: 'JSON parse failed',
                        raw_output: stdout,
                        err,
                        stderr,
                    });
                }
            });
            py.on('error', (err) => {
                if (fs.existsSync(tempFile))
                    fs.unlinkSync(tempFile);
                return reject({ message: 'Failed to start Python process', err });
            });
        });
    }
    extractJson(text) {
        text = text.replace(/[\x00-\x1F\x7F]/g, '');
        text = text.replace(/\n/g, '').replace(/\r/g, '').replace(/\t/g, '');
        let openIndex = -1;
        let braceCount = 0;
        let bracketCount = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (char === '{' || char === '[') {
                if (openIndex === -1) {
                    openIndex = i;
                }
                if (char === '{')
                    braceCount++;
                else
                    bracketCount++;
            }
            else if (char === '}' || char === ']') {
                if (char === '}')
                    braceCount--;
                else
                    bracketCount--;
                if (braceCount === 0 && bracketCount === 0 && openIndex !== -1) {
                    const candidate = text.substring(openIndex, i + 1);
                    try {
                        JSON.parse(candidate);
                        return candidate;
                    }
                    catch (e) {
                        openIndex = -1;
                        continue;
                    }
                }
            }
        }
        throw new Error('No valid JSON found in output');
    }
};
exports.PythonService = PythonService;
exports.PythonService = PythonService = PythonService_1 = __decorate([
    (0, common_1.Injectable)()
], PythonService);
//# sourceMappingURL=python.service.js.map