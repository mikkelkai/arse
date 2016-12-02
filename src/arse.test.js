import {Component, createElement} from './arse'
const test = require('tap').test

class Test extends Component {
  render () {
    return (
      createElement('div', {class: 'test'},
        [createElement('ul', null,
          createElement('li', null, 'item 1'),
          createElement('li', null, 'item 2'),
          createElement('li', null, 'item 3'),
          createElement(SubTestList, {amount: 6})
        )],
        createElement('div', {class: 'test'},
          'testing',
          createElement('p', null, 'p test'),
          'textNodes'
        ),
        createElement(SubTest, {testArr: [{msg: 'test data'}, {msg: 'More test data'}]},
          createElement('input', {placeholder: 'random input'}),
          createElement('input', {placeholder: 'more random input'})
        )
      )
    )
  }
}

class SubTest extends Component {
  render () {
    return (
      createElement('form', {action: '/test', method: 'POST'},
        [].concat(this.props.children)
      )
    )
  }
}

class SubTestList extends Component {
  render () {
    return (
      createElement('ul', null,
        new Array(this.props.amount).fill(null).map(_ => createElement('li', null, 'Auto generated'))
      )
    )
  }
}

const giantTestExpectation = {type: 'div', props: {class: 'test'}, children: [{type: 'ul', props: null, children: [{type: 'li', props: null, children: [{type: 'textNode', props: {text: 'item 1'}, children: []}]}, {type: 'li', props: null, children: [{type: 'textNode', props: {text: 'item 2'}, children: []}]}, {type: 'li', props: null, children: [{type: 'textNode', props: {text: 'item 3'}, children: []}]}, {type: 'ul', props: null, children: [{type: 'li', props: null, children: [{type: 'textNode', props: {text: 'Auto generated'}, children: []}]}, {type: 'li', props: null, children: [{type: 'textNode', props: {text: 'Auto generated'}, children: []}]}, {type: 'li', props: null, children: [{type: 'textNode', props: {text: 'Auto generated'}, children: []}]}, {type: 'li', props: null, children: [{type: 'textNode', props: {text: 'Auto generated'}, children: []}]}, {type: 'li', props: null, children: [{type: 'textNode', props: {text: 'Auto generated'}, children: []}]}, {type: 'li', props: null, children: [{type: 'textNode', props: {text: 'Auto generated'}, children: []}]}]}]}, {type: 'div', props: {class: 'test'}, children: [{type: 'textNode', props: {text: 'testing'}, children: []}, {type: 'p', props: null, children: [{type: 'textNode', props: {text: 'p test'}, children: []}]}, {type: 'textNode', props: {text: 'textNodes'}, children: []}]}, {type: 'form', props: {action: '/test', method: 'POST'}, children: [{type: 'input', props: {placeholder: 'random input'}, children: []}, {type: 'input', props: {placeholder: 'more random input'}, children: []}]}]}

test('Component test', (t) => {
  const defaultMsg = (msg) => 'Default: ' + msg
  const testMsg = (msg) => 'Test: ' + msg

  const prop = {test: 'some test data'}
  const defaultComponent = new Component(prop)
  const testComponent = new Test(prop)

  const propMatch = 'Passed props match component props'
  t.deepEqual(prop, defaultComponent.props, defaultMsg(propMatch))
  t.deepEqual(prop, testComponent.props, testMsg(propMatch))

  t.equal(undefined, defaultComponent.render(), defaultMsg('render should return undefined'))

  t.end()
})

test('Element creation test', (t) => {
  const els = [
    {
      actual: createElement('div'),
      expected: {type: 'div', props: undefined, children: []},
      msg: 'Simple div'
    }, {
      actual: createElement('div', {class: 'test'}),
      expected: {type: 'div', props: {class: 'test'}, children: []},
      msg: 'Div with a class'
    }, {
      actual: createElement('div', null, 'test'),
      expected: {type: 'div', props: null, children: [{type: 'textNode', props: {text: 'test'}, children: []}]},
      msg: 'Div containing text'
    }, {
      actual: createElement('div', null, createElement('div')),
      expected: {type: 'div', props: null, children: [{type: 'div', props: undefined, children: []}]},
      msg: 'Div containing another div'
    }, {
      actual: createElement('div', null, createElement('div'), createElement('div')),
      expected: {type: 'div', props: null, children: [{type: 'div', props: undefined, children: []}, {type: 'div', props: undefined, children: []}]},
      msg: 'Div containing two divs'
    }, {
      actual: createElement('div', null, [createElement('div'), createElement('div')]),
      expected: {type: 'div', props: null, children: [{type: 'div', props: undefined, children: []}, {type: 'div', props: undefined, children: []}]},
      msg: 'Div containing two divs in an array'
    }, {
      actual: createElement(Test, null),
      expected: giantTestExpectation,
      msg: 'Big component (Test) testing most cases'
    }
  ]

  els.forEach(el => {
    t.deepEqual(el.actual, el.expected, el.msg)
  })

  t.end()
})
