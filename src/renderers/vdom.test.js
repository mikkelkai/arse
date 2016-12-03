import 'jsdom-global/register'
import {diff, patch} from './vdom'
import * as action from './vdomActions'
import createElement from '../universal/createElement'
const test = require('tap').test

test('vdom diff test', (t) => {
  const empty = () => diff({}, {})
  t.throws(empty, 'Empty elements should throw')

  const wrongType = () => diff(0, 1)
  t.throws(wrongType, 'Elements of wrong type should throw')

  const diffTests = [
    {
      expected: [],
      actual: diff(createElement('div', {class: 'test-class'}), createElement('div', {class: 'test-class'})),
      msg: 'Same element should return no patches'
    }, {
      expected: [{type: action.SET_PROP, key: 'class', value: 'hot fire'}],
      actual: diff(createElement('div', {class: 'cold ice'}), createElement('div', {class: 'hot fire'})),
      msg: 'Prop change should return SET_PROP patch'
    }, {
      expected: [{type: action.SET_PROP, key: 'class', value: 'im new'}],
      actual: diff(createElement('div'), createElement('div', {class: 'im new'})),
      msg: 'Prop addition from no prop should return SET_PROP patch'
    }, {
      expected: [{type: action.SET_PROP, key: 'class', value: 'im new'}],
      actual: diff(createElement('div', {old: 'old'}), createElement('div', {old: 'old', class: 'im new'})),
      msg: 'Prop addition should return SET_PROP patch'
    }, {
      expected: [{type: action.REMOVE_PROP, key: 'remove'}],
      actual: diff(createElement('div', {remove: 'this should be removed'}), createElement('div')),
      msg: 'Prop removal of all props should return REMOVE_PROP patch'
    }, {
      expected: [{type: action.REMOVE_PROP, key: 'remove'}],
      actual: diff(createElement('div', {keep: 'keep me', remove: 'this should be removed'}), createElement('div', {keep: 'keep me'})),
      msg: 'Prop removal of one prop should return REMOVE_PROP patch'
    }, {
      expected: [{type: action.APPEND_NODE, pos: [], node: createElement('div')}],
      actual: diff(createElement('div', null), createElement('div', null, createElement('div'))),
      msg: 'Node addition should return APPEND_NODE patch'
    }, {
      expected: [{type: action.REPLACE_NODE, pos: [0], node: createElement('span')}],
      actual: diff(createElement('div', null, createElement('div')), createElement('div', null, createElement('span'))),
      msg: 'Node type change should return REPLACE_NODE patch'
    }, {
      expected: [{type: action.REMOVE_NODE, pos: [0]}],
      actual: diff(createElement('div', null, createElement('div')), createElement('div')),
      msg: 'Node removal should return REMOVE_NODE patch'
    }
  ]

  diffTests.forEach(test => {
    t.deepEqual(test.expected, test.actual, test.msg)
  })
  t.end()
})

test('vdom patch test', (t) => {
  t.end()
})
