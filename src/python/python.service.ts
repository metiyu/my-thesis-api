// import { Injectable, Logger } from '@nestjs/common';
// import { spawn } from 'child_process';
// import * as path from 'path';
// import * as fs from 'fs';

// @Injectable()
// export class PythonService {
// 	private readonly logger = new Logger(PythonService.name);
// 	async executePythonScript(script: string, args: any): Promise<any> {
// 		return new Promise((resolve, reject) => {
// 			const scriptPath = path.resolve(process.cwd(), 'scripts', 'new', script);
// 			const pythonPath = path.resolve(process.cwd(), 'venv', 'Scripts', 'python.exe');

// 			// 🔁 Buat nama file sementara
// 			const tempFile = path.resolve(process.cwd(), 'temp', `${Date.now()}_input.json`);

// 			// 📄 Tulis data ke file
// 			fs.writeFileSync(tempFile, JSON.stringify(args[0]));

// 			// const jsonArg = JSON.stringify(args[0]);
// 			console.log('Running Python:', pythonPath, scriptPath, '(using temp file)');

// 			const py = spawn(pythonPath, [scriptPath, tempFile], {
// 				cwd: process.cwd(),
// 				shell: false,
// 				env: process.env,
// 				stdio: ['ignore', 'pipe', 'pipe'], // 👈 pipe stderr/stdout
// 			});

// 			let stdout = '';
// 			let stderr = '';

// 			py.stdout.on('data', (data) => {
// 				stdout += data.toString('utf8'); // 👈 Paksa UTF-8
// 			});

// 			py.stderr.on('data', (data) => {
// 				stderr += data.toString('utf8');
// 			});

// 			py.on('close', (code) => {
// 				if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
// 				if (code !== 0) {
// 					console.error(`[Python] Exit Code: ${code}`);
// 					console.error(`[Python] STDERR: ${stderr}`);
// 					console.error(`[Python] STDOUT: ${stdout}`);
// 					return reject({
// 						message: `Python exited with code ${code}`,
// 						error: stderr || 'No stderr output',
// 					});
// 				}

// 				try {
// 					const cleanOutput = this.extractJson(stdout);
// 					return resolve(JSON.parse(cleanOutput));
// 				} catch (err) {
// 					console.error('[Python] JSON Parse Failed');
// 					console.error('[Python] Raw Output:', stdout);
// 					console.error('[Python] Stderr:', stderr);
// 					return reject({
// 						message: 'JSON parse failed',
// 						raw_output: stdout,
// 						err,
// 						stderr,
// 					});
// 				}
// 			});

// 			py.on('error', (err) => {
// 				if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
// 				return reject({ message: 'Failed to start Python process', err });
// 			});
// 		});
// 	}

// 	private extractJson(text: string): string {
// 		// Hilangkan karakter ilegal & whitespace berlebihan
// 		text = text.replace(/[\x00-\x1F\x7F]/g, ''); // Hapus karakter ASCII non-printable
// 		text = text.replace(/\n/g, '').replace(/\r/g, '').replace(/\t/g, ''); // Bersihkan newlines/tab

// 		let openIndex = -1;
// 		let braceCount = 0;
// 		let bracketCount = 0;

// 		for (let i = 0; i < text.length; i++) {
// 			const char = text[i];

// 			if (char === '{' || char === '[') {
// 				if (openIndex === -1) {
// 					openIndex = i;
// 				}
// 				if (char === '{') braceCount++;
// 				else bracketCount++;
// 			} else if (char === '}' || char === ']') {
// 				if (char === '}') braceCount--;
// 				else bracketCount--;

// 				if (braceCount === 0 && bracketCount === 0 && openIndex !== -1) {
// 					const candidate = text.substring(openIndex, i + 1);
// 					try {
// 						JSON.parse(candidate); // Validasi apakah benar-benar JSON
// 						return candidate;
// 					} catch (e) {
// 						// Coba cari JSON lain setelahnya
// 						openIndex = -1;
// 						continue;
// 					}
// 				}
// 			}
// 		}

// 		throw new Error('No valid JSON found in output');
// 	}
// }

// src/python/python.service.ts - Updated for Render
import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import { join } from 'path';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

@Injectable()
export class PythonService {
	private readonly logger = new Logger(PythonService.name);

	async executePythonScript(
		scriptName: string,
		args: string[] = [],
		inputData?: any,
	): Promise<any> {
		return new Promise((resolve, reject) => {
			try {
				// Create temp directory
				const tempDir = join(process.cwd(), 'temp');
				if (!existsSync(tempDir)) {
					mkdirSync(tempDir, { recursive: true });
				}

				// Script path
				const scriptsPath = join(process.cwd(), 'scripts', 'new');
				const scriptPath = join(scriptsPath, scriptName);

				this.logger.log(`🐍 Executing Python script: ${scriptPath}`);
				this.logger.log(`📋 Arguments: ${JSON.stringify(args)}`);

				// Handle input data
				if (inputData) {
					const inputFile = join(tempDir, `input_${Date.now()}.json`);
					writeFileSync(inputFile, JSON.stringify(inputData));
					args.push(inputFile);
				}

				// Use python3 command (available in Render)
				const pythonProcess = spawn('python3', [scriptPath, ...args], {
					cwd: process.cwd(),
					env: {
						...process.env,
						PYTHONPATH: scriptsPath,
						PYTHONUNBUFFERED: '1', // Important for real-time logging
					},
				});

				let stdout = '';
				let stderr = '';

				pythonProcess.stdout.on('data', (data) => {
					const output = data.toString();
					stdout += output;
					this.logger.log(`🐍 Python stdout: ${output.trim()}`);
				});

				pythonProcess.stderr.on('data', (data) => {
					const error = data.toString();
					stderr += error;
					this.logger.warn(`🐍 Python stderr: ${error.trim()}`);
				});

				pythonProcess.on('close', (code) => {
					if (code === 0) {
						try {
							const result = JSON.parse(stdout.trim());
							this.logger.log(`✅ Python script completed successfully`);
							resolve(result);
						} catch (parseError) {
							this.logger.log(`📄 Python script output (raw): ${stdout}`);
							resolve({ output: stdout.trim() });
						}
					} else {
						this.logger.error(`❌ Python script failed with code ${code}`);
						this.logger.error(`❌ Error: ${stderr}`);
						reject(new Error(`Python script failed: ${stderr || 'Unknown error'}`));
					}
				});

				pythonProcess.on('error', (error) => {
					this.logger.error(`❌ Failed to start Python process: ${error.message}`);
					reject(new Error(`Failed to execute Python script: ${error.message}`));
				});

				// Timeout for long scripts (Render has generous limits)
				const timeout = setTimeout(() => {
					pythonProcess.kill('SIGTERM');
					reject(new Error('Python script execution timed out (5 minutes)'));
				}, 300000); // 5 minutes

				pythonProcess.on('close', () => {
					clearTimeout(timeout);
				});

			} catch (error) {
				this.logger.error(`❌ Error setting up Python execution: ${error.message}`);
				reject(error);
			}
		});
	}
}