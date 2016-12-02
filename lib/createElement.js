'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createElement;
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