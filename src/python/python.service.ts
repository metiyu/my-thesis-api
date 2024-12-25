/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';

@Injectable()
export class PythonService {
	async executePythonScript(scriptName: string, args: string[]): Promise<any> {
		return new Promise((resolve, reject) => {
			console.log(`${process.cwd()}/script/${scriptName}`);
			const pythonProcess = spawn('python', [
				`${process.cwd()}/script/${scriptName}`,
				...args,
			]);

			let result = '';

			pythonProcess.stdout.on('data', (data) => {
				result += data.toString();
			});

			pythonProcess.stderr.on('data', (data) => {
				console.error(`Error: ${data}`);
			});

			pythonProcess.on('close', (code) => {
				if (code !== 0) {
					reject(`Process exited with code ${code}`);
					return;
				}
				try {
					resolve(JSON.parse(result));
				} catch {
					resolve(result);
				}
			});
		});
	}
}
