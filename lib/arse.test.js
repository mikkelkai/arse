'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _arse = require('./arse');

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
      return (0, _arse.createElement)('div', { class: 'test' }, [(0, _arse.createElement)('ul', null, (0, _arse.createElement)('li', null, 'item 1'), (0, _arse.createElement)('li', null, 'item 2'), (0, _arse.createElement)('li', null, 'item 3'), (0, _arse.createElement)(SubTestList, { amount: 6 }))], (0, _arse.createElement)('div', { class: 'test' }, 'testing', (0, _arse.createElement)('p', null, 'p test'), 'textNodes'), (0, _arse.createElement)(SubTest, { testArr: [{ msg: 'test data' }, { msg: 'More test data' }] }, (0, _arse.createElement)('input', { placeholder: 'random input' }), (0, _arse.createElement)('input', { placeholder: 'more random input' })));
    }
  }]);

  return Test;
}(_arse.Component);

var SubTest = function (_Component2) {
  _inherits(SubTest, _Component2);

  function SubTest() {
    _classCallCheck(this, SubTest);

    return _possibleConstructorReturn(this, (SubTest.__proto__ || Object.getPrototypeOf(SubTest)).apply(this, arguments));
  }

  _createClass(SubTest, [{
    key: 'render',
    value: function render() {
      return (0, _arse.createElement)('form', { action: '/test', method: 'POST' }, [].concat(this.props.children));
    }
  }]);

  return SubTest;
}(_arse.Component);

var SubTestList = function (_Component3) {
  _inherits(SubTestList, _Component3);

  function SubTestList() {
    _classCallCheck(this, SubTestList);

    return _possibleConstructorReturn(this, (SubTestList.__proto__ || Object.getPrototypeOf(SubTestList)).apply(this, arguments));
  }

  _createClass(SubTestList, [{
    key: 'render',
    value: function render() {
      return (0, _arse.createElement)('ul', null, new Array(this.props.amount).fill(null).map(function (_) {
        return (0, _arse.createElement)('li', null, 'Auto generated');
      }));
    }
  }]);

  return SubTestList;
}(_arse.Component);

var giantTestExpectation = { type: 'div', props: { class: 'test' }, children: [{ type: 'ul', props: null, children: [{ type: 'li', props: null, children: [{ type: 'textNode', props: { text: 'item 1' }, children: [] }] }, { type: 'li', props: null, children: [{ type: 'textNode', props: { text: 'item 2' }, children: [] }] }, { type: 'li', props: null, children: [{ type: 'textNode', props: { text: 'item 3' }, children: [] }] }, { type: 'ul', props: null, children: [{ type: 'li', props: null, children: [{ type: 'textNode', props: { text: 'Auto generated' }, children: [] }] }, { type: 'li', props: null, children: [{ type: 'textNode', props: { text: 'Auto generated' }, children: [] }] }, { type: 'li', props: null, children: [{ type: 'textNode', props: { text: 'Auto generated' }, children: [] }] }, { type: 'li', props: null, children: [{ type: 'textNode', props: { text: 'Auto generated' }, children: [] }] }, { type: 'li', props: null, children: [{ type: 'textNode', props: { text: 'Auto generated' }, children: [] }] }, { type: 'li', props: null, children: [{ type: 'textNode', props: { text: 'Auto generated' }, children: [] }] }] }] }, { type: 'div', props: { class: 'test' }, children: [{ type: 'textNode', props: { text: 'testing' }, children: [] }, { type: 'p', props: null, children: [{ type: 'textNode', props: { text: 'p test' }, children: [] }] }, { type: 'textNode', props: { text: 'textNodes' }, children: [] }] }, { type: 'form', props: { action: '/test', method: 'POST' }, children: [{ type: 'input', props: { placeholder: 'random input' }, children: [] }, { type: 'input', props: { placeholder: 'more random input' }, children: [] }] }] };

test('Component test', function (t) {
  var defaultMsg = function defaultMsg(msg) {
    return 'Default: ' + msg;
  };
  var testMsg = function testMsg(msg) {
    return 'Test: ' + msg;
  };

  var prop = { test: 'some test data' };
  var defaultComponent = new _arse.Component(prop);
  var testComponent = new Test(prop);

  var propMatch = 'Passed props match component props';
  t.deepEqual(prop, defaultComponent.props, defaultMsg(propMatch));
  t.deepEqual(prop, testComponent.props, testMsg(propMatch));

  t.equal(undefined, defaultComponent.render(), defaultMsg('render should return undefined'));

  t.end();
});

test('Element creation test', function (t) {
  var els = [{
    actual: (0, _arse.createElement)('div'),
    expected: { type: 'div', props: undefined, children: [] },
    msg: 'Simple div'
  }, {
    actual: (0, _arse.createElement)('div', { class: 'test' }),
    expected: { type: 'div', props: { class: 'test' }, children: [] },
    msg: 'Div with a class'
  }, {
    actual: (0, _arse.createElement)('div', null, 'test'),
    expected: { type: 'div', props: null, children: [{ type: 'textNode', props: { text: 'test' }, children: [] }] },
    msg: 'Div containing text'
  }, {
    actual: (0, _arse.createElement)('div', null, (0, _arse.createElement)('div')),
    expected: { type: 'div', props: null, children: [{ type: 'div', props: undefined, children: [] }] },
    msg: 'Div containing another div'
  }, {
    actual: (0, _arse.createElement)('div', null, (0, _arse.createElement)('div'), (0, _arse.createElement)('div')),
    expected: { type: 'div', props: null, children: [{ type: 'div', props: undefined, children: [] }, { type: 'div', props: undefined, children: [] }] },
    msg: 'Div containing two divs'
  }, {
    actual: (0, _arse.createElement)('div', null, [(0, _arse.createElement)('div'), (0, _arse.createElement)('div')]),
    expected: { type: 'div', props: null, children: [{ type: 'div', props: undefined, children: [] }, { type: 'div', props: undefined, children: [] }] },
    msg: 'Div containing two divs in an array'
  }, {
    actual: (0, _arse.createElement)(Test, null),
    expected: giantTestExpectation,
    msg: 'Big component (Test) testing most cases'
  }];

  els.forEach(function (el) {
    t.deepEqual(el.actual, el.expected, el.msg);
  });

  t.end();
});