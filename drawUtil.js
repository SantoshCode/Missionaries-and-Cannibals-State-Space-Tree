// BELOW CODE IS SETUP FOR TREE PLOTTING
const draw = (treeData) => {
  const keyValue = {};
  treeData.forEach((item) => {
    keyValue[item[0].join(",")] = item[1];
  });

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

    return item[1].map((item) => {
      return {
        name: item,
        parent: key.join(","),
        fill:
          item === FINAL_STATE_ON_RIGHT_SIDE.join(",")
            ? "yellow"
            : item === "1,1,1"
            ? "lightgreen"
            : generateValue(item),
        value: 50,
      };
    });
  });

  data.unshift({
    name: INITIAL_STATE_ON_RIGHT_SIDE.join(","),
    parent: null,
    fill: "lightgreen",
    value: 50,
  });

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
};
