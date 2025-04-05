import { exec } from 'child_process';
import { baseDir, getLastTagCommand } from './config';

const getLastTag = async (subdir: string) => {
    return new Promise((resolve, reject) => {
        process.chdir(subdir);
        exec(getLastTagCommand, (error, stdout, stderr) => {
            process.chdir(baseDir);
            if (error) {
                console.error(`Error executing command: ${error.message}`);
                reject(error);
            } else {
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                }
                resolve(stdout.trim());
            }
        });
    });
};

export { getLastTag };
