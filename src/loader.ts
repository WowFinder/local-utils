import { exec } from 'child_process';
import fs from 'fs';
import { resolve } from 'path';
import { chdir } from 'process';
import { baseDir, mainRepos } from './config';
import { getDeps } from './depsChecks';
import { getLastTag } from './git';
import { PendingVersion, ReposData } from './types';

function getHighestPendingVersion(raw: string): PendingVersion {
    if (raw.indexOf('major') > -1) {
        return 'major';
    } else if (raw.indexOf('minor') > -1) {
        return 'minor';
    } else if (raw.indexOf('patch') > -1) {
        return 'patch';
    } else {
        return '';
    }
}

async function getPendingVersions(repo: string): Promise<PendingVersion> {
    const pendingVersionsDir = `${baseDir}/${repo}/.yarn/versions`;
    return new Promise(resolve => {
        try {
            if (!fs.existsSync(pendingVersionsDir)) {
                return resolve('');
            }
            exec(`cat ${pendingVersionsDir}/*.yml`, (error, stdout) => {
                if (error) {
                    resolve('');
                }
                    resolve(getHighestPendingVersion(stdout));
            });
        } catch (error) {
            console.error(
                `Error reading pending versions for ${repo}: ${error}`,);
            resolve('');
        }
    });
}

async function loadReposData(): Promise<ReposData> {
    const reposData: ReposData = {};
    chdir(baseDir);
    for (const repo of mainRepos) {
        const tag = await getLastTag(repo);
        const pckJson = `${repo}/package.json`;
        let packageJson: any;
        try {
            const packageContent = fs.readFileSync(pckJson, 'utf-8');
            packageJson = JSON.parse(packageContent);
        } catch (error: any) {
            console.error(
                `Error reading or parsing ${pckJson}: ${error?.message}`,
            );
            continue;
        }
        reposData[repo] = {
            lastTag: tag ? `${tag}` : '',
            packageVersion: packageJson?.version ?? '',
            projectDeps: getDeps(packageJson?.dependencies),
            pendingVersions: await getPendingVersions(repo),
        };
    }
    return reposData;
}

export { loadReposData };
