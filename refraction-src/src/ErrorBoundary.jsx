import { Component } from 'react'

// Scopes a failure to the WebGL canvas only. Without this, an error thrown
// anywhere inside <Canvas> (a lost context, a shader compile failure, a
// failed asset fetch past Suspense) unmounts the whole React tree with
// nothing rendered at all — including the HTML content that has nothing to
// do with WebGL. This keeps that failure local and visible instead.
export default class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.error('3D scene failed to render:', error)
  }
  render() {
    if (this.state.failed) {
      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            textAlign: 'center',
            color: 'var(--ink-dim)',
            fontSize: 13,
            letterSpacing: '.04em',
          }}
        >
          The WebGL scene couldn&rsquo;t render in this browser — the page content below still works.
        </div>
      )
    }
    return this.props.children
  }
}
