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

  const _getState = () => {
    return _state
  }

  const _component = new Component(_state)
  const _mountNode = mountNode

  let _tree = _component.render()
  // change _rootNode to const
  let _rootNode = renderElement(_tree)
  _mountNode.appendChild(_rootNode)

  const _render = () => {
    _component.props = _state
    _tree = _component.render()
    removeChildren(_rootNode)
    appendChildren(_rootNode, renderElement(_tree).childNodes)
  }

  const _dispatch = (action) => {
    _state = _reducer(_state, action)
    _render()
  }

  if (typeof state === 'undefined') return
  if (!reducerExist) return {getState: _getState}
  return {
    dispatch: _dispatch,
    getState: _getState
  }
}

function renderElement (tree) {
  if (tree.type === 'textNode') return document.createTextNode(tree.props.text)

  const el = document.createElement(tree.type)

  if (tree.props !== null && typeof tree.props === 'object') {
    Object.getOwnPropertyNames(tree.props).map(key => {
      el.setAttribute(key, tree.props[key])
    })
  }

  tree.children.forEach(child => {
    el.appendChild(renderElement(child))
  })

  return el
}

function removeChildren (node) {
  Array.prototype.slice.call(node.childNodes).forEach(child => {
    node.removeChild(child)
  })
}

function appendChildren (node, children) {
  Array.prototype.slice.call(children).forEach(child => {
    node.appendChild(child)
  })
}
