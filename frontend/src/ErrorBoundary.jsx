import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error('APP CRASH:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          background: '#000',
          minHeight: '100vh',
          fontFamily: 'monospace',
          color: '#fff'
        }}>
          <h2 style={{ color: '#ff4757', marginBottom: '20px' }}>
            App Crashed
          </h2>
          <pre style={{
            background: '#111',
            padding: '20px',
            borderRadius: '8px',
            color: '#ff4757',
            whiteSpace: 'pre-wrap',
            fontSize: '13px',
            marginBottom: '20px'
          }}>
            {this.state.error?.toString()}
            {'\n\n'}
            {this.state.errorInfo?.componentStack}
          </pre>
          <button
            onClick={() => this.setState({
              hasError: false,
              error: null,
              errorInfo: null
            })}
            style={{
              padding: '10px 20px',
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '700'
            }}
          >
            Try Again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
