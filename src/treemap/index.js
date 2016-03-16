import hierarchy from "../hierarchy";
import rebind from "../rebind";
import {visitBefore} from "../visit";
import squarify from "./squarify";

export default function() {
  var layout = hierarchy(),
      dx = 1,
      dy = 1,
      paddingInner = 0,
      paddingOuter = 0,
      paddingOffset = 0,
      tile = squarify,
      round = false;

  function treemap(d) {
    var nodes = layout(d);
    position(nodes[0]);
    return nodes;
  }

  function position(root) {
    root.x0 =
    root.y0 = -paddingInner;
    root.x1 = dx + paddingInner;
    root.y1 = dy + paddingInner;
    visitBefore(root, positionNode);
    if (round) visitBefore(root, treemapRound);
  }

  function positionNode(node) {
    var x0 = node.x0 + paddingInner,
        y0 = node.y0 + paddingInner,
        x1 = node.x1 - paddingInner,
        y1 = node.y1 - paddingInner;
    if (x1 < x0) node.x0 = node.x1 = x0 = x1 = (node.x0 + node.x1) / 2;
    else node.x0 = x0, node.x1 = x1;
    if (y1 < y0) node.y0 = node.y1 = x0 = x1 = (node.y0 + node.y1) / 2;
    else node.y0 = y0, node.y1 = y1;
    if (node.children) {
      x0 += paddingOffset;
      y0 += paddingOffset;
      x1 -= paddingOffset;
      y1 -= paddingOffset;
      if (x1 < x0) x0 = x1 = (node.x0 + node.x1) / 2;
      if (y1 < y0) y0 = y1 = (node.y0 + node.y1) / 2;
      tile(node, x0, y0, x1, y1);
    }
  }

  rebind(treemap, layout);

  treemap.revalue = function(nodes) {
    layout.revalue(nodes);
    position(nodes[0]);
    return nodes;
  };

  treemap.round = function(x) {
    return arguments.length ? (round = !!x, treemap) : round;
  };

  treemap.size = function(x) {
    return arguments.length ? (dx = +x[0], dy = +x[1], treemap) : [dx, dy];
  };

  treemap.tile = function(x) {
    return arguments.length ? (tile = x, treemap) : tile;
  };

  treemap.padding = function(x) {
    return arguments.length ? (paddingInner = (paddingOuter = +x) / 2, paddingOffset = paddingInner, treemap) : paddingInner * 2;
  };

  treemap.paddingInner = function(x) {
    return arguments.length ? (paddingInner = x / 2, paddingOffset = paddingOuter - paddingInner, treemap) : paddingInner * 2;
  };

  treemap.paddingOuter = function(x) {
    return arguments.length ? (paddingOuter = +x, paddingOffset = paddingOuter - paddingInner, treemap) : paddingOuter;
  };

  return treemap;
}

function treemapRound(d) {
  d.x0 = Math.round(d.x0);
  d.y0 = Math.round(d.y0);
  d.x1 = Math.round(d.x1);
  d.y1 = Math.round(d.y1);
}
