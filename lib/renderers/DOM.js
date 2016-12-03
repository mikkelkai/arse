'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = render;
function render(Component, mountNode, state, reducer) {
  if (typeof Component !== 'function') throw new TypeError('Component needs to be a function');
  // instancof Component
  if (mountNode instanceof window.Element !== true) throw new TypeError('MountNode needs to be an element');

  var reducerExist = false;
  var _reducer = void 0;if (reducer !== undefined && reducer !== null) {
    if (typeof reducer !== 'function') throw new TypeError('Reducer needs to be a function with parameters (state, action)');
    reducerExist = true;
    _reducer = reducer;
  }

  var _state = state || {};

  var _getState = function _getState() {
    return _state;
  };

  var _component = new Component(_state);
  var _mountNode = mountNode;

  var _tree = _component.render();
  // change _rootNode to const
  var _rootNode = renderElement(_tree);
  _mountNode.appendChild(_rootNode);

  var _render = function _render() {
    _component.props = _state;
    _tree = _component.render();
    removeChildren(_rootNode);
    appendChildren(_rootNode, renderElement(_tree).childNodes);
  };

  var _dispatch = function _dispatch(action) {
    _state = _reducer(_state, action);
    _render();
  };

  if (typeof state === 'undefined') return;
  if (!reducerExist) return { getState: _getState };
  return {
    dispatch: _dispatch,
    getState: _getState
  };
}

function renderElement(tree) {
  if (tree.type === 'textNode') return document.createTextNode(tree.props.text);

  var el = document.createElement(tree.type);

  if (tree.props !== null && _typeof(tree.props) === 'object') {
    Object.getOwnPropertyNames(tree.props).map(function (key) {
      el.setAttribute(key, tree.props[key]);
    });
  }

  tree.children.forEach(function (child) {
    el.appendChild(renderElement(child));
  });

  return el;
}

function removeChildren(node) {
  Array.prototype.slice.call(node.childNodes).forEach(function (child) {
    node.removeChild(child);
  });
}

function appendChildren(node, children) {
  Array.prototype.slice.call(children).forEach(function (child) {
    node.appendChild(child);
  });
}