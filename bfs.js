// 1-right
// 0-left

const INITIAL_STATE_ON_RIGHT_SIDE = [3, 3, 1]; // 3m, 3c, boat present

const FINAL_STATE_ON_RIGHT_SIDE = [0, 0, 0]; // 0m, 0c, boat present

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

  if (boatState === 1) {
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

bfs([3, 3, 1]);

const tree = {
  name: "3,3,1",
  value: 15,
  type: "black",
  level: "lightgreen",
  children: [],
};
const keyValue = {};
treeData.forEach((item) => {
  keyValue[item[0].join(",")] = item[1];
});

console.log(treeData);
console.log(keyValue);

const generateValue = (item) => {
  let color = "lightgreen";
  if (keyValue[item] === undefined) {
    color = "red";
  } else if (keyValue[item].length === 0) {
    color = "grey";
  }
  return color;
};
const data = treeData.flatMap((item) => {
  const key = item[0];
  value = item[1];

  return item[1].map((item) => ({
    name: item,
    parent: key.join(","),
    fill: item === "0,0,0" ? "yellow" : generateValue(item),
    value: 50,
  }));
});

data.unshift({
  name: "3,3,1",
  parent: null,
  fill: "lightgreen",
  value: 50,
});
console.log(data);

// create a name: node map
let dataMap = data.reduce(function (map, node) {
  map[node.name] = node;
  return map;
}, {});

// create the tree array
let treeDat = [];
data.forEach(function (node) {
  // add to parent
  let parent = dataMap[node.parent];
  if (parent) {
    // create child array if it doesn't exist
    (parent.children || (parent.children = []))
      // add node to child array
      .push(node);
  } else {
    // parent is null or missing
    treeDat.push(node);
  }
});

// ************** Generate the tree diagram	 *****************
let margin = { top: 100, right: 0, bottom: 0, left: 0 },
  width = 2200 - margin.right - margin.left,
  height = 2200 - margin.top - margin.bottom;

let i = 0;

let d3tree = d3.layout.tree().size([height, width]);

let diagonal = d3.svg.diagonal().projection(function (d) {
  return [d.x, d.y];
});

let svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

root = treeDat[0];

update(root);

function update(source) {
  // Compute the new tree layout.
  let nodes = d3tree.nodes(root).reverse(),
    links = d3tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function (d) {
    d.y = d.depth * 180;
  });

  // Declare the nodes…
  let node = svg.selectAll("g.node").data(nodes, function (d) {
    return d.id || (d.id = ++i);
  });

  // Enter the nodes.
  let nodeEnter = node
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

  nodeEnter
    .append("circle")
    .attr("r", (d) => d.value)
    .style("fill", (d) => d.fill)
    .style("stroke", (d) => "black");

  nodeEnter
    .append("text")
    .attr("x", function (d) {
      return -30;
    })
    .attr("dy", ".35em")
    .text(function (d) {
      return d.name;
    });

  // Declare the links…
  let link = svg.selectAll("path.link").data(links, function (d) {
    return d.target.id;
  });

  // Enter the links.
  link.enter().insert("path", "g").attr("class", "link").attr("d", diagonal);
}
