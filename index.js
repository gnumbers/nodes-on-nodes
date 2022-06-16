import fetch from 'node-fetch';
import _ from 'lodash';

const BASE_URL = 'https://nodes-on-nodes-challenge.herokuapp.com/nodes';

const fetchChildren = async (ids) => {
  const idArrayStr = ids.join(',');

  try {
    const response = await fetch(`${BASE_URL}/${idArrayStr}`).then((response) =>
      response.json()
    );

    return response;
  } catch (err) {
    console.error(err);
  }

  return [];
};

const traverseTree = async (rootId) => {
  let ids = [rootId];
  const uniqueIds = {
    [rootId]: 0,
  };

  while (ids.length > 0) {
    const nodes = await fetchChildren(ids);
    ids = [];

    nodes.forEach((n) => {
      if (uniqueIds[n.id] === undefined) {
        uniqueIds[n.id] = n.child_node_ids.length + 1;
      } else {
        uniqueIds[n.id] += 1;
      }
    });
    ids = _.uniq(nodes.flatMap((n) => n.child_node_ids));
    ids = _.difference(ids, Object.keys(uniqueIds));
  }

  const uniqueIdEntries = Object.entries(uniqueIds);
  const count = uniqueIdEntries.length;
  const maxShared = _.maxBy(uniqueIdEntries, 1);

  return {
    count,
    maxShared,
  };
};

const main = async () => {
  const rootId = '089ef556-dfff-4ff2-9733-654645be56fe';
  console.log('Traversing now. Please wait...');

  const { count, maxShared } = await traverseTree(rootId);

  console.log('1. Total number of unique nodes:', count);
  console.log('2. Most shared node Id: %s (%d)', maxShared[0], maxShared[1]);
};

main();
