import { indentString } from './config';
import type {
    PendingVersion,
    ProjectDeps,
    RepoDataEntry,
    ReposData,
} from './types';
import { compareVersionStrings } from './versions';

function indent(val: number = 1): string {
    return indentString.repeat(val);
}

function printProjectDeps(initialIndent: number, deps: ProjectDeps) {
    const indentation = indent(initialIndent);
    if (Object.keys(deps).length === 0) {
        console.log(`${indentation}projectDeps: {}`);
    } else {
        console.log(`${indentation}projectDeps: {`);
        for (const dep in deps) {
            console.log(`${indentation}${indent()}${dep}: ${deps[dep]},`);
        }
        console.log(`${indentation}}`);
    }
}

function printPendingVersions(
    initialIndent: number,
    pendingVersions: PendingVersion,
) {
    if (pendingVersions) {
        console.log(
            `${indent(initialIndent)}⚠️  pendingVersions: ${pendingVersions}`,
        );
    }
}

function printProjectData(key: string, data: RepoDataEntry): void {
    const { lastTag, packageVersion, projectDeps, pendingVersions } = data;
    const versionCheck = compareVersionStrings(lastTag, packageVersion);
    const tagSuffix =
        versionCheck === 0 ? '✔️' : versionCheck > 0 ? '🛑' : '⚠️';
    console.log(`${indent()}${key}: {`);
    console.log(`${indent(2)}lastTag: ${lastTag} ${tagSuffix},`);
    console.log(`${indent(2)}packageVersion: ${packageVersion},`);
    printPendingVersions(2, pendingVersions);
    printProjectDeps(2, projectDeps);
    console.log(`${indent()}}`);
}

function showFullData(reposData: ReposData, buildOrder: string[]) {
    console.log('Full Repos Data:');
    for (const repo of buildOrder) {
        const data = reposData[repo];
        if (!data) {
            console.error(`No data found for repo ${repo}`);
            continue;
        }
        printProjectData(repo, data);
    }
}

export { printProjectData, showFullData };
