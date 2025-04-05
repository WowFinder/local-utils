import { computeBuildOrder, validateBuildOrder } from './depsChecks';
import { loadReposData } from './loader';
import { showFullData } from './output';

(async function () {
    const reposData = await loadReposData();
    const buildOrder = computeBuildOrder(reposData);

    if (buildOrder && validateBuildOrder(reposData, buildOrder)) {
        showFullData(reposData, buildOrder);
        console.log(`✔️  Build order validated: [${buildOrder.join(', ')}]`);
    } else {
        console.error(`❌  Build order validation failed`);
    }
})();
