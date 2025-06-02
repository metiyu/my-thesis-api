/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';

@Injectable()
export class PythonService {
	async executePythonScript(scriptName: string, args: string[]): Promise<any> {
		return new Promise((resolve, reject) => {
			const venvPath = path.join(
				process.cwd(),
				'venv', // Adjust this path as needed
				'Scripts',  // Use 'Scripts' instead of 'bin' on Windows
				'python'
			);
			const pythonProcess = spawn(venvPath, [
				`${process.cwd()}/script/${scriptName}`,
				...args,
			]);

			let result = '';

			pythonProcess.stdout.on('data', (data) => {
				result += data.toString();
			});

			pythonProcess.stderr.on('data', (data) => {
				console.error(`Python script error: ${data}`);
			});

			pythonProcess.on('close', (code) => {
				if (code !== 0) {
					reject(`Process exited with code ${code}`);
					return;
				}

				try {
					// Coba parse langsung
					const parsed = JSON.parse(result);
					resolve(parsed);
				} catch (e) {
					// Jika gagal, bersihkan output
					try {
						// Hapus semua baris sampai ditemukan '{' atau '['
						const cleaned = result.slice(result.indexOf('{') === -1 ? result.indexOf('[') : result.indexOf('{'));

						// Ambil hanya bagian yang mungkin valid sebagai JSON
						const jsonStart = cleaned.charAt(0);
						const jsonEnd = jsonStart === '{' ? '}' : ']';

						// Temukan akhir dari JSON object/array
						let depth = 0;
						let endIndex = 0;

						for (let i = 0; i < cleaned.length; i++) {
							if (cleaned[i] === jsonStart) depth++;
							else if (cleaned[i] === jsonEnd) {
								depth--;
								if (depth === 0) {
									endIndex = i + 1;
									break;
								}
							}
						}

						const cleanJson = cleaned.substring(0, endIndex);
						resolve(JSON.parse(cleanJson));
					} catch (innerError) {
						reject(`Failed to parse or clean Python output: ${result}`);
					}
				}
			});
		});
	}
}
