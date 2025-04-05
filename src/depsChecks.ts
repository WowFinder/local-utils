import { mainRepos } from './config';
import { type ProjectDeps, type ReposData } from './types';

const getDeps = (deps: { [key: string]: string } | undefined): ProjectDeps => {
    const filteredDeps: ProjectDeps = {};
    for (const dep in deps) {
        if (dep.startsWith('@wowfinder/')) {
            const depKey = dep.replace('@wowfinder/', '');
            if (mainRepos.includes(depKey)) {
                filteredDeps[depKey] = deps[dep];
            }
        }
    }
    return filteredDeps;
};

function getFirstHead(
    reposData: ReposData,
    included: string[],
    pending: string[],
): [string, string[]] {
    for (const repo of pending) {
        // it is a good head if all its dependencies are already included in the build order
        const missingDeps = Object.keys(reposData[repo].projectDeps).filter(
            dep => !included.includes(dep),
        );
        if (missingDeps.length === 0) {
            return [repo, pending.filter(r => r !== repo)];
        }
    }
    console.error(
        `No valid head found in the pending repos: ${pending.join(', ')}`,
    );
    return ['', pending];
}

function computeBuildOrder(reposData: ReposData): string[] | null {
    const included: string[] = [];
    let pending = mainRepos.slice();
    while (pending.length > 0) {
        const [head, newPending] = getFirstHead(reposData, included, pending);
        if (!head) {
            return null;
        }
        included.push(head);
        pending = newPending;
    }
    return included;
}

function validateBuildOrder(
    reposData: ReposData,
    buildOrder: string[] | null,
): boolean {
    if (!buildOrder) {
        return false;
    }
    const visited = new Set<string>();
    for (const repo of buildOrder) {
        const deps = Object.keys(reposData[repo].projectDeps);
        for (const dep of deps) {
            if (!visited.has(dep)) {
                console.error(
                    `Invalid build order: ${repo} depends on ${dep}, which is not built yet.`,
                );
                return false;
            }
        }
        visited.add(repo);
    }
    return true;
}

export { getDeps, computeBuildOrder, validateBuildOrder };
