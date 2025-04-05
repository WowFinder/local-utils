const baseDir = '/home/edurne/repos/@github.com/WowFinder';

const mainRepos = [
    'asset-schemas',
    // 'bridge-electron',
    'bridge-https',
    'core-node',
    'model',
    'react-components',
    'translations',
    'ts-enums',
    'ts-utils',
];

const modulePrefix = '@wowfinder/';

const getLastTagCommand =
    'git describe --tags `git rev-list --tags --max-count=1`';

const indentString = '  ';

export { baseDir, mainRepos, modulePrefix, getLastTagCommand, indentString };
