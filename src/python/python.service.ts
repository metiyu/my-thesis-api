import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class PythonService {
	// async executePythonScript(scriptName: string, args: string[]): Promise<any> {
	// 	return new Promise((resolve, reject) => {
	// 		// const scriptPath = path.resolve(process.cwd(), 'script', scriptName);
	// 		// const venvPythonPath = path.resolve(process.cwd(), 'venv', 'Scripts', 'python.exe');

	// 		// // 🔍 Debugging path
	// 		// console.log('Running script:', scriptPath);
	// 		// console.log('Using Python from:', venvPythonPath);

	// 		// if (!fs.existsSync(venvPythonPath)) {
	// 		// 	return reject(`Python executable not found at: ${venvPythonPath}`);
	// 		// }

	// 		// // const pythonProcess = spawn(venvPythonPath, [scriptPath, ...args]);
	// 		// const pythonProcess = spawn(venvPythonPath, [scriptPath, ...args], {
	// 		// 	env: {
	// 		// 		...process.env,
	// 		// 		PATH: `${path.resolve(process.cwd(), 'venv', 'Scripts')};${process.env.PATH}`,
	// 		// 		VIRTUAL_ENV: path.resolve(process.cwd(), 'venv'),
	// 		// 		PYTHONPATH: path.resolve(process.cwd(), 'venv', 'Lib', 'site-packages')
	// 		// 	}
	// 		// });
	// 		const scriptPath = path.resolve(process.cwd(), 'script', scriptName);
	// 		const venvPath = path.resolve(process.cwd(), 'venv');
	// 		const activateScript = path.join(venvPath, 'Scripts', 'activate.bat');

	// 		// Create a batch command that activates venv and runs the script
	// 		const command = `"${activateScript}" && python "${scriptPath}" ${args.join(' ')}`;

	// 		console.log('Running command:', command);

	// 		const pythonProcess = spawn('cmd', ['/c', command], {
	// 			cwd: process.cwd(),
	// 			shell: true
	// 		});

	// 		let result = '';
	// 		let errorOutput = '';

	// 		pythonProcess.stdout.on('data', (data) => {
	// 			result += data.toString();
	// 		});

	// 		pythonProcess.stderr.on('data', (data) => {
	// 			const errorStr = data.toString();
	// 			errorOutput += errorStr;
	// 			console.error(`Python script error: ${errorStr}`);
	// 		});

	// 		pythonProcess.on('close', (code) => {
	// 			if (code !== 0) {
	// 				return reject(`Python process exited with code ${code}: ${errorOutput}`);
	// 			}

	// 			try {
	// 				const parsed = JSON.parse(result);
	// 				return resolve(parsed);
	// 			} catch (e) {
	// 				try {
	// 					const cleaned = this.extractJson(result);
	// 					return resolve(JSON.parse(cleaned));
	// 				} catch (innerError) {
	// 					return reject({
	// 						message: 'Failed to parse or clean Python output',
	// 						raw_output: result,
	// 						error: innerError,
	// 					});
	// 				}
	// 			}
	// 		});
	// 	});
	// }

	async executePythonScript(scriptName: string, args: string[]): Promise<any> {
		return new Promise((resolve, reject) => {
			const scriptPath = path.resolve(process.cwd(), 'script', scriptName);
			const venvPath = path.resolve(process.cwd(), 'venv');
			// const activateScript = path.join(venvPath, 'Scripts', 'activate.bat');
			const pythonExecutable = path.join(venvPath, 'Scripts', 'python.exe');

			// // Properly format the arguments - escape quotes for the ticker array
			// const formattedArgs = args.map(arg => {
			// 	if (arg.startsWith('[') && arg.endsWith(']')) {
			// 		return `"${arg}"`;  // Wrap array string in quotes
			// 	}
			// 	return arg;
			// }).join(' ');

			// const command = `"${activateScript}" && python "${scriptPath}" ${formattedArgs}`;
			// const command = `"${pythonExecutable}" "${scriptPath}" ${formattedArgs}`;

			// console.log('Running command:', command);

			// const pythonProcess = spawn('cmd', ['/c', command], {
			// 	cwd: process.cwd(),
			// 	shell: true
			// });

			// Construct full argument array: [scriptPath, ...args]
			const fullArgs = [scriptPath, ...args];

			const pythonProcess = spawn(pythonExecutable, fullArgs, {
				cwd: process.cwd(),
			});

			console.log('Running script:', pythonProcess.spawnargs.join(' '));

			let result = '';
			let errorOutput = '';

			pythonProcess.stdout.on('data', (data) => {
				result += data.toString();
			});

			pythonProcess.stderr.on('data', (data) => {
				const errorStr = data.toString();
				errorOutput += errorStr;
				console.error(`Python script error: ${errorStr}`);
			});

			pythonProcess.on('close', (code) => {
				if (code !== 0) {
					return reject(`Python process exited with code ${code}: ${errorOutput}`);
				}

				try {
					const parsed = JSON.parse(result);
					return resolve(parsed);
				} catch (e) {
					try {
						const cleaned = this.extractJson(result);
						return resolve(JSON.parse(cleaned));
					} catch (innerError) {
						return reject({
							message: 'Failed to parse or clean Python output',
							raw_output: result,
							error: innerError,
						});
					}
				}
			});
		});
	}

	private extractJson(text: string): string {
		let jsonStartIndex = -1;
		let openBraces = 0;

		for (let i = 0; i < text.length; i++) {
			const char = text[i];

			if (jsonStartIndex === -1 && (char === '{' || char === '[')) {
				jsonStartIndex = i;
				openBraces = 0;
			}

			if (jsonStartIndex !== -1) {
				if (char === '{' || char === '[') openBraces++;
				else if (char === '}' || char === ']') {
					openBraces--;
					if (openBraces === 0) {
						const candidate = text.substring(jsonStartIndex, i + 1);
						try {
							JSON.parse(candidate);
							return candidate;
						} catch (e) {
							return this.extractJson(text.substring(i + 1));
						}
					}
				}
			}
		}

		throw new Error('No valid JSON found in output');
	}
}