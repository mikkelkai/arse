'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.diff = diff;
exports.patch = patch;

var _vdomActions = require('./vdomActions');

var actions = _interopRequireWildcard(_vdomActions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function diff(oldTree, newTree) {
  if ((typeof oldTree === 'undefined' ? 'undefined' : _typeof(oldTree)) !== 'object' || (typeof newTree === 'undefined' ? 'undefined' : _typeof(newTree)) !== 'object' || !validTree(oldTree) || !validTree(newTree)) throw new TypeError('Diff needs elements as arguments');
  return getDiff([], oldTree, newTree);
}

function validTree(tree) {
  return JSON.stringify(Object.getOwnPropertyNames(tree)) === '["type","props","children"]';
}

function getDiff(pos, oldTree, newTree) {
  if (oldTree === undefined) return [{ type: actions.APPEND_NODE, pos: pos.slice(0, pos.length - 1), node: newTree }];
  if (newTree === undefined) return [{ type: actions.REMOVE_NODE, pos: pos }];
  var patches = [];
  if (oldTree.type !== newTree.type) {
    console.log(patches.concat([{ type: actions.REPLACE_NODE, pos: pos, node: newTree }]));return patches.concat([{ type: actions.REPLACE_NODE, pos: pos, node: newTree }]);
  }

  switch (true) {
    case newTree.props === undefined || newTree.props === null:
      patches = patches.concat(removeProps(oldTree));
      break;
    case oldTree.props === undefined || oldTree.props === null:
      patches = patches.concat(addProps(newTree));
      break;
    default:
      patches = patches.concat(compareProps(oldTree, newTree));
  }

  var nChildren = 0;
  var diffAmount = oldTree.children.length - newTree.children.length;
  switch (true) {
    case diffAmount === 0:
      nChildren = oldTree.children.length;
      break;
    case diffAmount < 0:
      nChildren = oldTree.children.length + -diffAmount;
      break;
    default:
      nChildren = newTree.children.length + diffAmount;
  }

  for (var i = 0; i < nChildren; i++) {
    patches = patches.concat(getDiff([].concat(_toConsumableArray(pos), [i]), oldTree.children[i], newTree.children[i]));
  }

  return patches;
}

function compareProps(oldTree, newTree) {
  var allKeys = new Set(Object.getOwnPropertyNames(oldTree.props).concat(Object.getOwnPropertyNames(newTree.props)));

  var patches = [];

  allKeys.forEach(function (key) {
    var patch = handleProp(key, oldTree.props[key], newTree.props[key]);
    if (patch !== undefined) patches.push(patch);
  });

  return patches;
}

function handleProp(key, oldProp, newProp) {
  switch (true) {
    case newProp === undefined:
      return { type: actions.REMOVE_PROP, key: key };
    case oldProp === undefined || newProp !== oldProp:
      return { type: actions.SET_PROP, key: key, value: newProp };
    default:
      return;
  }
}

function removeProps(tree) {
  if (tree.props === undefined || tree.props === null) return [];
  return Object.getOwnPropertyNames(tree.props).map(function (key) {
    return { type: actions.REMOVE_PROP, key: key };
  });
}

function addProps(tree) {
  if (tree.props === undefined || tree.props === null) return [];
  return Object.getOwnPropertyNames(tree.props).map(function (key) {
    return { type: actions.SET_PROP, key: key, value: tree.props[key] };
  });
}

function patch() {}

exports.default = {
  diff: diff,
  patch: patch
};