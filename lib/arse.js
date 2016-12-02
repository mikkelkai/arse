'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createElement = createElement;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Component = exports.Component = function () {
  function Component(props) {
    _classCallCheck(this, Component);

    this.props = props;
    this.ctx = {};
  }

  _createClass(Component, [{
    key: 'render',
    value: function render() {
      return;
    }
  }]);

  return Component;
}();

function createElement(type, props) {
  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  if (typeof type === 'function') {
    var newProps = props || {};
    newProps.children = children;
    return new type(newProps).render();
  }

  var trueChildren = children.reduce(function (prev, curr) {
    if (Array.isArray(curr)) return prev.concat(curr);
    if (typeof curr === 'string') return prev.concat([{ type: 'textNode', props: { text: curr }, children: [] }]);
    return prev.concat([curr]);
  }, []);

  return {
    type: type,
    props: props,
    children: trueChildren
  };
}