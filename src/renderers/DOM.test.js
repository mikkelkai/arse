import 'jsdom-global/register'
import render from './DOM'
import Component from '../universal/component'
import createElement from '../universal/createElement'
const test = require('tap').test

class Test extends Component {
  render () {
    return (
      createElement('div')
    )
  }
}

const ADD_TODO = 'ADD_TODO'

function addTodoAction (task) {
  return {type: ADD_TODO, task: task}
}

function addTodo (state, task) {
  return Object.assign({}, state, {
    todos: [...state.todos, {task: task, complete: false}]
  })
}

function reducer (state, action) {
  switch (action.type) {
    case ADD_TODO:
      return addTodo(state, action.task)
    default:
      return state
  }
}

const testState = {todos: []}

test('render test', (t) => {
  document.body.appendChild(document.createElement('div'))
  const root = window.document.querySelector('div')

  const noArgs = () => render()
  t.throw(noArgs, 'Throws on no args')

  const nonFunctionComponent = () => render(null, root)
  t.throw(nonFunctionComponent, 'Throws on non function component')

  const noMountNode = () => render(Test)
  t.throw(noMountNode, 'Throws on no mountNode')

  const noDispatchUndefined = render(Test, root)
  t.equal('undefined', typeof noDispatchUndefined, 'Returns undefined when not provided a reducer function')

  const noDispatchNull = render(Test, root, testState, null)
  t.equal('undefined', typeof noDispatchNull, 'Returns undefined when provided null value')

  const noDispatchNonFunction = () => render(Test, root, testState, 1)
  t.throws(noDispatchNonFunction, 'Render throws when provided a non function value that is not null or undefined')

  let oldRoot = root.cloneNode(true)
  const dispatch = render(Test, root, testState, reducer)
  t.equal('function', typeof dispatch, 'Returns a function when provided a reducer function')

  t.notOk(root.isEqualNode(oldRoot), 'Root node changed after initial render')

  oldRoot = root.cloneNode(true)
  dispatch(addTodoAction('test'))
  t.notOk(root.isEqualNode(oldRoot), 'Root node changed after dispatch')

  t.end()
})

