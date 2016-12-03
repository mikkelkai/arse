import 'jsdom-global/register'
import render from './DOM'
import Component from '../universal/component'
import createElement from '../universal/createElement'
const test = require('tap').test

class Test extends Component {
  render () {
    return (
      createElement('ul', null,
        this.props.todos.map(todo => createElement('li', null, todo.task))
      )
    )
  }
}

class NoStateTest extends Component {
  render () {
    return (
      createElement('div', {class: 'test-class'})
    )
  }
}

const ADD_TODO = 'ADD_TODO'
const REMOVE_TODO = 'REMOVE_TODO'

function addTodoAction (task) {
  return {type: ADD_TODO, task: task}
}

function addTodo (state, task) {
  return Object.assign({}, state, {
    todos: [...state.todos, {task: task, complete: false}]
  })
}

function removeTodoAction (index) {
  return {type: REMOVE_TODO, index: index}
}

function removeTodo (state, index) {
  return Object.assign({}, state, {
    todos: [...state.todos.slice(0, index), ...state.todos.slice(index + 1, state.todos.length)]
  })
}

function reducer (state, action) {
  switch (action.type) {
    case ADD_TODO:
      return addTodo(state, action.task)
    case REMOVE_TODO:
      return removeTodo(state, action.index)
    default:
      return state
  }
}

const testState = {
  todos: []
}

test('render test', (t) => {
  document.body.appendChild(document.createElement('div'))
  const root = window.document.querySelector('div')

  const noArgs = () => render()
  t.throw(noArgs, 'Throws on no args')

  const nonFunctionComponent = () => render(null, root)
  t.throw(nonFunctionComponent, 'Throws on non function component')

  const noMountNode = () => render(NoStateTest)
  t.throw(noMountNode, 'Throws on no mountNode')

  const noDispatchUndefined = render(NoStateTest, root)
  t.equal('undefined', typeof noDispatchUndefined, 'Returns undefined when not provided a reducer function')

  const noDispatchNull = render(Test, root, testState, null)
  t.equal('function', typeof noDispatchNull.getState, 'Returns getState when state is provided')
  t.equal('undefined', typeof noDispatchNull.dispatch, 'Returns no dispatch function when reducer is not provided')

  const noDispatchNonFunction = () => render(Test, root, testState, 1)
  t.throws(noDispatchNonFunction, 'Render throws when provided a non function value that is not null or undefined')

  let oldRoot = root.cloneNode(true)
  const ctx = render(Test, root, testState, reducer)
  t.equal('function', typeof ctx.getState, 'Returns getState when state is provided')
  t.equal('function', typeof ctx.dispatch, 'Returns dispatch when reducer is provided')

  t.notOk(root.isEqualNode(oldRoot), 'Root node changed after initial render')

  oldRoot = root.cloneNode(true)
  ctx.dispatch({})
  t.ok(root.isEqualNode(oldRoot), 'Root node no change after empty dispatch')

  oldRoot = root.cloneNode(true)
  ctx.dispatch(addTodoAction('test'))
  t.notOk(root.isEqualNode(oldRoot), 'Root node changed after add todo dispatch')
  t.deepEqual({todos: [{task: 'test', complete: false}]}, ctx.getState(), 'State should be updated after add todo dispatch')

  oldRoot = root.cloneNode(true)
  ctx.dispatch(removeTodoAction(0))
  t.notOk(root.isEqualNode(oldRoot), 'Root node changed after remove todo dispatch')
  t.deepEqual({todos: []}, ctx.getState(), 'State should be updated after remove todo dispatch')

  t.end()
})

