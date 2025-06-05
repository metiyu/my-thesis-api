// import { Injectable } from '@nestjs/common';
// import { spawn } from 'child_process';
// import * as path from 'path';
// import * as fs from 'fs';

// @Injectable()
// export class PythonService {
// 	async executePythonScript(scriptName: string, args: string[]): Promise<any> {
// 		return new Promise((resolve, reject) => {
// 			const scriptPath = path.resolve(process.cwd(), 'script', 'new', scriptName);
// 			console.log('CWD:', process.cwd());
// 			console.log('Script Path:', scriptPath);
// 			const venvPath = path.resolve(process.cwd(), 'venv');
// 			const pythonExecutable = path.join(venvPath, 'Scripts', 'python.exe');
// 			console.log('Using Python from:', pythonExecutable);


// 			// Construct full argument array: [scriptPath, ...args]
// 			const fullArgs = [scriptPath, ...args];

// 			const pythonProcess = spawn(pythonExecutable, fullArgs, {
// 				cwd: process.cwd(),
// 				shell: true,
// 			});

// 			console.log('Running script:', pythonProcess.spawnargs.join(' '));

// 			let result = '';
// 			let errorOutput = '';

// 			pythonProcess.stdout.on('data', (data) => {
// 				result += data.toString();
// 			});

// 			pythonProcess.stderr.on('data', (data) => {
// 				const errorStr = data.toString();
// 				errorOutput += errorStr;
// 				console.error(`Python script error: ${errorStr}`);
// 			});

// 			pythonProcess.on('close', (code) => {
// 				if (code !== 0) {
// 					return reject(`Python process exited with code ${code}: ${errorOutput}`);
// 				}

// 				try {
// 					const parsed = JSON.parse(result);
// 					return resolve(parsed);
// 				} catch (e) {
// 					try {
// 						const cleaned = this.extractJson(result);
// 						return resolve(JSON.parse(cleaned));
// 					} catch (innerError) {
// 						return reject({
// 							message: 'Failed to parse or clean Python output',
// 							raw_output: result,
// 							error: innerError,
// 						});
// 					}
// 				}
// 			});
// 		});
// 	}

// 	private extractJson(text: string): string {
// 		let jsonStartIndex = -1;
// 		let openBraces = 0;

// 		for (let i = 0; i < text.length; i++) {
// 			const char = text[i];

// 			if (jsonStartIndex === -1 && (char === '{' || char === '[')) {
// 				jsonStartIndex = i;
// 				openBraces = 0;
// 			}

// 			if (jsonStartIndex !== -1) {
// 				if (char === '{' || char === '[') openBraces++;
// 				else if (char === '}' || char === ']') {
// 					openBraces--;
// 					if (openBraces === 0) {
// 						const candidate = text.substring(jsonStartIndex, i + 1);
// 						try {
// 							JSON.parse(candidate);
// 							return candidate;
// 						} catch (e) {
// 							return this.extractJson(text.substring(i + 1));
// 						}
// 					}
// 				}
// 			}
// 		}

// 		throw new Error('No valid JSON found in output');
// 	}
// }


import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class PythonService {
	async executePythonScript(script: string, args: any): Promise<any> {
		return new Promise((resolve, reject) => {
			const scriptPath = path.resolve(process.cwd(), 'scripts', 'new', script);
			const pythonPath = path.resolve(process.cwd(), 'venv', 'Scripts', 'python.exe');

			// 🔁 Buat nama file sementara
			const tempFile = path.resolve(process.cwd(), 'temp', `${Date.now()}_input.json`);

			// 📄 Tulis data ke file
			fs.writeFileSync(tempFile, JSON.stringify(args[0]));

			// const jsonArg = JSON.stringify(args[0]);
			console.log('Running Python:', pythonPath, scriptPath, '(using temp file)');

			const py = spawn(pythonPath, [scriptPath, tempFile], {
				cwd: process.cwd(),
				shell: false,
				env: process.env,
				stdio: ['ignore', 'pipe', 'pipe'], // 👈 pipe stderr/stdout
			});

			let stdout = '';
			let stderr = '';

			py.stdout.on('data', (data) => {
				stdout += data.toString('utf8'); // 👈 Paksa UTF-8
			});

			py.stderr.on('data', (data) => {
				stderr += data.toString('utf8');
			});

			py.on('close', (code) => {
				if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
				if (code !== 0) {
					console.error(`[Python] Exit Code: ${code}`);
					console.error(`[Python] STDERR: ${stderr}`);
					console.error(`[Python] STDOUT: ${stdout}`);
					return reject({
						message: `Python exited with code ${code}`,
						error: stderr || 'No stderr output',
					});
				}

				try {
					const cleanOutput = this.extractJson(stdout);
					return resolve(JSON.parse(cleanOutput));
				} catch (err) {
					console.error('[Python] JSON Parse Failed');
					console.error('[Python] Raw Output:', stdout);
					console.error('[Python] Stderr:', stderr);
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

	// private extractJson(text: string): string {
	// 	const jsonStartIndex = text.indexOf('{');
	// 	const jsonStartArrayIndex = text.indexOf('[');
	// 	const startIndex = Math.min(jsonStartIndex, jsonStartArrayIndex);
	// 	if (startIndex === -1) throw new Error('No JSON found in output');

	// 	let openBraces = 0;
	// 	let closeBraces = 0;

	// 	for (let i = startIndex; i < text.length; i++) {
	// 		const char = text[i];
	// 		if (char === '{' || char === '[') openBraces++;
	// 		else if (char === '}' || char === ']') closeBraces++;

	// 		if (openBraces > 0 && openBraces === closeBraces) {
	// 			const candidate = text.substring(startIndex, i + 1);
	// 			try {
	// 				JSON.parse(candidate);
	// 				return candidate;
	// 			} catch (e) {
	// 				continue;
	// 			}
	// 		}
	// 	}

	// 	throw new Error('No valid JSON found in output');
	// }

	private extractJson(text: string): string {
		// Hilangkan karakter ilegal & whitespace berlebihan
		text = text.replace(/[\x00-\x1F\x7F]/g, ''); // Hapus karakter ASCII non-printable
		text = text.replace(/\n/g, '').replace(/\r/g, '').replace(/\t/g, ''); // Bersihkan newlines/tab

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
						JSON.parse(candidate); // Validasi apakah benar-benar JSON
						return candidate;
					} catch (e) {
						// Coba cari JSON lain setelahnya
						openIndex = -1;
						continue;
					}
				}
			}
		}

		throw new Error('No valid JSON found in output');
	}
}