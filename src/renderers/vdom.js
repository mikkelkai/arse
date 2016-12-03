import * as actions from './vdomActions'

export function diff (oldTree, newTree) {
  if (typeof oldTree !== 'object' || typeof newTree !== 'object' || !validTree(oldTree) || !validTree(newTree)) throw new TypeError('Diff needs elements as arguments')
  return getDiff([], oldTree, newTree)
}

function validTree (tree) {
  return JSON.stringify(Object.getOwnPropertyNames(tree)) === '["type","props","children"]'
}

function getDiff (pos, oldTree, newTree) {
  if (oldTree === undefined) return [{type: actions.APPEND_NODE, pos: pos.slice(0, pos.length - 1), node: newTree}]
  if (newTree === undefined) return [{type: actions.REMOVE_NODE, pos}]
  let patches = []
  if (oldTree.type !== newTree.type) { console.log(patches.concat([{type: actions.REPLACE_NODE, pos, node: newTree}])); return patches.concat([{type: actions.REPLACE_NODE, pos, node: newTree}]) }

  switch (true) {
    case newTree.props === undefined || newTree.props === null:
      patches = patches.concat(removeProps(oldTree))
      break
    case oldTree.props === undefined || oldTree.props === null:
      patches = patches.concat(addProps(newTree))
      break
    default:
      patches = patches.concat(compareProps(oldTree, newTree))
  }

  let nChildren = 0
  const diffAmount = oldTree.children.length - newTree.children.length
  switch (true) {
    case diffAmount === 0:
      nChildren = oldTree.children.length
      break
    case diffAmount < 0:
      nChildren = oldTree.children.length + (-diffAmount)
      break
    default:
      nChildren = newTree.children.length + diffAmount
  }

  for (let i = 0; i < nChildren; i++) {
    patches = patches.concat(getDiff([...pos, i], oldTree.children[i], newTree.children[i]))
  }

  return patches
}

function compareProps (oldTree, newTree) {
  let allKeys = new Set(Object.getOwnPropertyNames(oldTree.props).concat(Object.getOwnPropertyNames(newTree.props)))

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
      return {type: actions.REMOVE_PROP, key: key}
    case oldProp === undefined || newProp !== oldProp:
      return {type: actions.SET_PROP, key: key, value: newProp}
    default:
      return
  }
}

function removeProps (tree) {
  if (tree.props === undefined || tree.props === null) return []
  return Object.getOwnPropertyNames(tree.props).map(key => {
    return {type: actions.REMOVE_PROP, key}
  })
}

function addProps (tree) {
  if (tree.props === undefined || tree.props === null) return []
  return Object.getOwnPropertyNames(tree.props).map(key => {
    return {type: actions.SET_PROP, key, value: tree.props[key]}
  })
}

export function patch () {}

export default {
  diff,
  patch
}
