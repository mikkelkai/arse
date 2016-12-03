'use strict';

require('jsdom-global/register');

var _vdom = require('./vdom');

var _vdomActions = require('./vdomActions');

var action = _interopRequireWildcard(_vdomActions);

var _createElement = require('../universal/createElement');

var _createElement2 = _interopRequireDefault(_createElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var test = require('tap').test;

test('vdom diff test', function (t) {
  var empty = function empty() {
    return (0, _vdom.diff)({}, {});
  };
  t.throws(empty, 'Empty elements should throw');

  var wrongType = function wrongType() {
    return (0, _vdom.diff)(0, 1);
  };
  t.throws(wrongType, 'Elements of wrong type should throw');

  var diffTests = [{
    expected: [],
    actual: (0, _vdom.diff)((0, _createElement2.default)('div', { class: 'test-class' }), (0, _createElement2.default)('div', { class: 'test-class' })),
    msg: 'Same element should return no patches'
  }, {
    expected: [{ type: action.SET_PROP, key: 'class', value: 'hot fire' }],
    actual: (0, _vdom.diff)((0, _createElement2.default)('div', { class: 'cold ice' }), (0, _createElement2.default)('div', { class: 'hot fire' })),
    msg: 'Prop change should return SET_PROP patch'
  }, {
    expected: [{ type: action.SET_PROP, key: 'class', value: 'im new' }],
    actual: (0, _vdom.diff)((0, _createElement2.default)('div'), (0, _createElement2.default)('div', { class: 'im new' })),
    msg: 'Prop addition from no prop should return SET_PROP patch'
  }, {
    expected: [{ type: action.SET_PROP, key: 'class', value: 'im new' }],
    actual: (0, _vdom.diff)((0, _createElement2.default)('div', { old: 'old' }), (0, _createElement2.default)('div', { old: 'old', class: 'im new' })),
    msg: 'Prop addition should return SET_PROP patch'
  }, {
    expected: [{ type: action.REMOVE_PROP, key: 'remove' }],
    actual: (0, _vdom.diff)((0, _createElement2.default)('div', { remove: 'this should be removed' }), (0, _createElement2.default)('div')),
    msg: 'Prop removal of all props should return REMOVE_PROP patch'
  }, {
    expected: [{ type: action.REMOVE_PROP, key: 'remove' }],
    actual: (0, _vdom.diff)((0, _createElement2.default)('div', { keep: 'keep me', remove: 'this should be removed' }), (0, _createElement2.default)('div', { keep: 'keep me' })),
    msg: 'Prop removal of one prop should return REMOVE_PROP patch'
  }, {
    expected: [{ type: action.APPEND_NODE, pos: [], node: (0, _createElement2.default)('div') }],
    actual: (0, _vdom.diff)((0, _createElement2.default)('div', null), (0, _createElement2.default)('div', null, (0, _createElement2.default)('div'))),
    msg: 'Node addition should return APPEND_NODE patch'
  }, {
    expected: [{ type: action.REPLACE_NODE, pos: [0], node: (0, _createElement2.default)('span') }],
    actual: (0, _vdom.diff)((0, _createElement2.default)('div', null, (0, _createElement2.default)('div')), (0, _createElement2.default)('div', null, (0, _createElement2.default)('span'))),
    msg: 'Node type change should return REPLACE_NODE patch'
  }, {
    expected: [{ type: action.REMOVE_NODE, pos: [0] }],
    actual: (0, _vdom.diff)((0, _createElement2.default)('div', null, (0, _createElement2.default)('div')), (0, _createElement2.default)('div')),
    msg: 'Node removal should return REMOVE_NODE patch'
  }];

  diffTests.forEach(function (test) {
    t.deepEqual(test.expected, test.actual, test.msg);
  });
  t.end();
});

test('vdom patch test', function (t) {
  t.end();
});