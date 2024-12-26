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
                'venv', // Name of the venv directory
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
