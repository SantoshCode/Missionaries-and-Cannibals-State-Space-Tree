// 1-right
// 0-left

const BOAT_PRESENT = 1;
const BOAT_PRESENT_ON_RIGHT_SIDE = BOAT_PRESENT;
const BOAT_ABSENT_ON_RIGHT_SIDE = 0;

const MISSIONARIES_NUMBER = 3;
const CANNIBALS_NUMBER = 3;

const INITIAL_STATE_ON_RIGHT_SIDE = [
  MISSIONARIES_NUMBER,
  CANNIBALS_NUMBER,
  BOAT_PRESENT_ON_RIGHT_SIDE,
]; // 3m, 3c, boat present

const FINAL_STATE_ON_RIGHT_SIDE = [0, 0, BOAT_ABSENT_ON_RIGHT_SIDE]; // 0m, 0c, boat absent

let currentState = "";
const goalState = FINAL_STATE_ON_RIGHT_SIDE.join("");

const ALL_GENERATED_STATES = [];

const checkAlreadyExist = (state) => {
  return ALL_GENERATED_STATES.includes(state.join(""));
};

const isValidState = (state) => {
  const validNumbers = [0, 1, 2, 3];
  const missionaries = state[0];
  const cannibals = state[1];

  if (!validNumbers.includes(missionaries)) return false;
  if (!validNumbers.includes(cannibals)) return false;

  return true;
};

const pushToAllGeneratedState = (state) => {
  if (!ALL_GENERATED_STATES.includes(state.join(""))) {
    ALL_GENERATED_STATES.push(state.join(""));
  }
};

const isFeasibleState = (state) => {
  const missionaries = state[0];
  const cannibals = state[1];

  if (cannibals !== 0 && missionaries !== 0 && cannibals > missionaries)
    return false;

  const otherSideMissionaries = 3 - missionaries; // 0
  const otherSideCannibals = 3 - cannibals; // 2

  if (
    otherSideMissionaries !== 0 &&
    otherSideCannibals !== 0 &&
    otherSideCannibals > otherSideMissionaries
  )
    return false;

  return true;
};

const getPossibleStates = (state) => {
  const missionaries = state[0];
  const cannibals = state[1];

  const boatState = state[2];

  if (boatState === BOAT_PRESENT) {
    // 1 -> Boat present State on either side
    const states = [
      [missionaries, cannibals - 1, 0],
      [missionaries, cannibals - 2, 0],
      [missionaries - 1, cannibals, 0],
      [missionaries - 2, cannibals, 0],
      [missionaries - 1, cannibals - 1, 0],
    ];

    const validStates = states.filter((item) => isValidState(item));

    const cleanedAliveStates = validStates.filter(
      (item) => !checkAlreadyExist(item)
    );

    pushToAllGeneratedState(state);

    validStates.forEach((item) => {
      pushToAllGeneratedState(item);
    });

    return cleanedAliveStates;
  } else {
    const states = [
      [missionaries, cannibals + 1, 1],
      [missionaries, cannibals + 2, 1],
      [missionaries + 1, cannibals, 1],
      [missionaries + 2, cannibals, 1],
      [missionaries + 1, cannibals + 1, 1],
    ];

    const validStates = states.filter((item) => isValidState(item));

    const cleanedAliveStates = validStates.filter(
      (item) => !checkAlreadyExist(item)
    );

    pushToAllGeneratedState(state);

    validStates.forEach((item) => {
      pushToAllGeneratedState(item);
    });

    return cleanedAliveStates;
  }
};

const treeData = [];

const bfs = (start) => {
  const queue = [start];
  const visited = new Set();

  while (queue.length > 0) {
    const item = queue.shift();

    if (visited.has(goalState)) break;

    const children = getPossibleStates(item);

    if (!visited.has(item.join(""))) {
      visited.add(item.join(""));
    }

    treeData.push([item, children.map((item) => item.join(","))]);

    for (const child of children.filter((item) => isFeasibleState(item))) {
      if (!visited.has(child.join(""))) {
        visited.add(child.join(""));
        queue.push(child);
      }
    }
  }
};

bfs(INITIAL_STATE_ON_RIGHT_SIDE);

draw(treeData);
