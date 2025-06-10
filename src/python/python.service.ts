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

import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class PythonService {
	private readonly logger = new Logger(PythonService.name);

	async executePythonScript(script: string, args: any): Promise<any> {
		return new Promise((resolve, reject) => {
			const scriptPath = path.resolve(process.cwd(), 'scripts', 'new', script);

			// On Replit, use system Python 3 directly
			const pythonExec = 'python3'; // NOT python.exe or venv path

			// Ensure temp directory exists
			const tempDir = path.resolve(process.cwd(), 'temp');
			if (!fs.existsSync(tempDir)) {
				fs.mkdirSync(tempDir);
			}

			// Create unique temp input file
			const tempFile = path.resolve(tempDir, `${Date.now()}_input.json`);
			fs.writeFileSync(tempFile, JSON.stringify(args[0]));

			this.logger.log(`Running Python: ${pythonExec} ${scriptPath} with ${tempFile}`);

			const py = spawn(pythonExec, [scriptPath, tempFile], {
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
				if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);

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
				} catch (err) {
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
				if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
				return reject({ message: 'Failed to start Python process', err });
			});
		});
	}

	private extractJson(text: string): string {
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
				if (char === '{') braceCount++;
				else bracketCount++;
			} else if (char === '}' || char === ']') {
				if (char === '}') braceCount--;
				else bracketCount--;

				if (braceCount === 0 && bracketCount === 0 && openIndex !== -1) {
					const candidate = text.substring(openIndex, i + 1);
					try {
						JSON.parse(candidate);
						return candidate;
					} catch (e) {
						openIndex = -1;
						continue;
					}
				}
			}
		}

		throw new Error('No valid JSON found in output');
	}
}