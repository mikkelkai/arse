export default function createElement (type, props, ...children) {
  if (typeof type === 'function') {
    const newProps = props || {}
    newProps.children = children
    return new type(newProps).render()
  }

  const trueChildren = children.reduce((prev, curr) => {
    if (Array.isArray(curr)) return prev.concat(curr)
    if (typeof curr === 'string') return prev.concat([{type: 'textNode', props: {text: curr}, children: []}])
    return prev.concat([curr])
  }, [])

  return {
    type,
    props,
    children: trueChildren
  }
}
