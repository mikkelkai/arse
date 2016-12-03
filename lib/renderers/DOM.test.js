'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('jsdom-global/register');

var _DOM = require('./DOM');

var _DOM2 = _interopRequireDefault(_DOM);

var _component = require('../universal/component');

var _component2 = _interopRequireDefault(_component);

var _createElement = require('../universal/createElement');

var _createElement2 = _interopRequireDefault(_createElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var test = require('tap').test;

var Test = function (_Component) {
  _inherits(Test, _Component);

  function Test() {
    _classCallCheck(this, Test);

    return _possibleConstructorReturn(this, (Test.__proto__ || Object.getPrototypeOf(Test)).apply(this, arguments));
  }

  _createClass(Test, [{
    key: 'render',
    value: function render() {
      return (0, _createElement2.default)('ul', null, this.props.todos.map(function (todo) {
        return (0, _createElement2.default)('li', null, todo.task);
      }));
    }
  }]);

  return Test;
}(_component2.default);

var NoStateTest = function (_Component2) {
  _inherits(NoStateTest, _Component2);

  function NoStateTest() {
    _classCallCheck(this, NoStateTest);

    return _possibleConstructorReturn(this, (NoStateTest.__proto__ || Object.getPrototypeOf(NoStateTest)).apply(this, arguments));
  }

  _createClass(NoStateTest, [{
    key: 'render',
    value: function render() {
      return (0, _createElement2.default)('div', { class: 'test-class' });
    }
  }]);

  return NoStateTest;
}(_component2.default);

var ADD_TODO = 'ADD_TODO';
var REMOVE_TODO = 'REMOVE_TODO';

function addTodoAction(task) {
  return { type: ADD_TODO, task: task };
}

function addTodo(state, task) {
  return Object.assign({}, state, {
    todos: [].concat(_toConsumableArray(state.todos), [{ task: task, complete: false }])
  });
}

function removeTodoAction(index) {
  return { type: REMOVE_TODO, index: index };
}

function removeTodo(state, index) {
  return Object.assign({}, state, {
    todos: [].concat(_toConsumableArray(state.todos.slice(0, index)), _toConsumableArray(state.todos.slice(index + 1, state.todos.length)))
  });
}

function reducer(state, action) {
  switch (action.type) {
    case ADD_TODO:
      return addTodo(state, action.task);
    case REMOVE_TODO:
      return removeTodo(state, action.index);
    default:
      return state;
  }
}

var testState = {
  todos: []
};

test('render test', function (t) {
  document.body.appendChild(document.createElement('div'));
  var root = window.document.querySelector('div');

  var noArgs = function noArgs() {
    return (0, _DOM2.default)();
  };
  t.throw(noArgs, 'Throws on no args');

  var nonFunctionComponent = function nonFunctionComponent() {
    return (0, _DOM2.default)(null, root);
  };
  t.throw(nonFunctionComponent, 'Throws on non function component');

  var noMountNode = function noMountNode() {
    return (0, _DOM2.default)(NoStateTest);
  };
  t.throw(noMountNode, 'Throws on no mountNode');

  var noDispatchUndefined = (0, _DOM2.default)(NoStateTest, root);
  t.equal('undefined', typeof noDispatchUndefined === 'undefined' ? 'undefined' : _typeof(noDispatchUndefined), 'Returns undefined when not provided a reducer function');

  var noDispatchNull = (0, _DOM2.default)(Test, root, testState, null);
  t.equal('function', _typeof(noDispatchNull.getState), 'Returns getState when state is provided');
  t.equal('undefined', _typeof(noDispatchNull.dispatch), 'Returns no dispatch function when reducer is not provided');

  var noDispatchNonFunction = function noDispatchNonFunction() {
    return (0, _DOM2.default)(Test, root, testState, 1);
  };
  t.throws(noDispatchNonFunction, 'Render throws when provided a non function value that is not null or undefined');

  var oldRoot = root.cloneNode(true);
  var ctx = (0, _DOM2.default)(Test, root, testState, reducer);
  t.equal('function', _typeof(ctx.getState), 'Returns getState when state is provided');
  t.equal('function', _typeof(ctx.dispatch), 'Returns dispatch when reducer is provided');

  t.notOk(root.isEqualNode(oldRoot), 'Root node changed after initial render');

  oldRoot = root.cloneNode(true);
  ctx.dispatch({});
  t.ok(root.isEqualNode(oldRoot), 'Root node no change after empty dispatch');

  oldRoot = root.cloneNode(true);
  ctx.dispatch(addTodoAction('test'));
  t.notOk(root.isEqualNode(oldRoot), 'Root node changed after add todo dispatch');
  t.deepEqual({ todos: [{ task: 'test', complete: false }] }, ctx.getState(), 'State should be updated after add todo dispatch');

  oldRoot = root.cloneNode(true);
  ctx.dispatch(removeTodoAction(0));
  t.notOk(root.isEqualNode(oldRoot), 'Root node changed after remove todo dispatch');
  t.deepEqual({ todos: [] }, ctx.getState(), 'State should be updated after remove todo dispatch');

  t.end();
});