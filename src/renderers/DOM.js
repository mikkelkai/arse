export default function render (Component, mountNode, state, reducer) {
  if (typeof Component !== 'function') throw new TypeError('Component needs to be a function')
  // instancof Component
  if (mountNode instanceof window.Element !== true) throw new TypeError('MountNode needs to be an element')

  let reducerExist = false
  let _reducer
  ;if (reducer !== undefined && reducer !== null) {
    if (typeof reducer !== 'function') throw new TypeError('Reducer needs to be a function with parameters (state, action)')
    reducerExist = true
    _reducer = reducer
  }

  let _state = state || {}

  const _component = new Component(_state)
  const _mountNode = mountNode

  let _tree = _component.render()
  // change _rootNode to const
  let _rootNode = renderElement(_tree)
  _mountNode.appendChild(_rootNode)

  const _render = () => {
    _component.props = _state
    _tree = _component.render()
    _rootNode = renderElement(_tree)
    _mountNode.appendChild(_rootNode)
  }

  const _dispatch = (action) => {
    _state = _reducer(_state, action)
    _render()
  }

  if (!reducerExist) return
  return _dispatch
}

function renderElement (tree) {
  if (tree.type === 'textNode') return document.createTextNode(tree.props.text)

  const el = document.createElement(tree.type)

  if (typeof tree.props === 'object') {
    Object.keys(tree.props).map(key => {
      el.setAttribute(key, tree.props[key])
    })
  }

  tree.children.forEach(child => renderElement(child))

  return el
}

// Entertaining an idea
/* const SET_PROP = 'SET_PROP'
const REMOVE_PROP = 'REMOVE_PROP'

function compareProps (oldTree, newTree) {
  let allKeys = new Set(Object.keys(oldTree.props).concat(Object.keys(newTree.props)))

  let patches = []

  allKeys.forEach(key => {
    const patch = handleProp(key, oldTree.props[key], newTree.props[key])
    if (patch !== undefined) patches.push(patch)
  })

  return patches
}

function handleProp (key, oldProp, newProp) {
  switch (true) {
    case newProp === undefined:
      return {type: REMOVE_PROP, key: key}
    case oldProp === undefined || newProp !== oldProp:
      return {type: SET_PROP, key: key, prop: newProp}
    default:
      return undefined
  }
} */
