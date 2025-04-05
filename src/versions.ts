import type { Version } from './types';

function getVersion(version: string): Version {
    const parts = version.replaceAll('v', '').split('.').map(Number);
    if (parts.length === 3) {
        return parts as [number, number, number];
    }
    return [0, 0, 0];
}

function compareVersions(version1: Version, version2: Version): number {
    for (let i = 0; i < 3; i++) {
        if (version1[i] > version2[i]) {
            return 1;
        } else if (version1[i] < version2[i]) {
            return -1;
        }
    }
    return 0;
}

function compareVersionStrings(version1: string, version2: string): number {
    const v1 = getVersion(version1);
    const v2 = getVersion(version2);
    return compareVersions(v1, v2);
}

export { getVersion, compareVersions, compareVersionStrings, type Version };
