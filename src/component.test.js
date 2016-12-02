import {Component, createElement} from './arse'
const test = require('tap').test

class Test extends Component {
  render () {
    return (
      createElement('div')
    )
  }
}

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
