type ProjectDeps = Partial<Record<string, string>>;

type Version = [number, number, number];

type PendingVersion = 'major' | 'minor' | 'patch' | '';

type RepoDataEntry = {
    lastTag: string;
    packageVersion: string;
    projectDeps: ProjectDeps;
    pendingVersions: PendingVersion;
};

type ReposData = {
    [key: string]: RepoDataEntry;
};

export type { ProjectDeps, RepoDataEntry, ReposData, Version, PendingVersion };
