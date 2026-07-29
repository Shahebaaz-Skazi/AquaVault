import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });
    console.error('AquaVault Tab Crash:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', color: '#fff' }}>
          <h2 style={{ marginBottom: '12px' }}>Tab crashed</h2>
          <pre style={{
            background: '#111', padding: '16px', borderRadius: '8px',
            fontSize: '12px', color: '#ff4757', whiteSpace: 'pre-wrap',
            border: '1px solid rgba(255,71,87,0.3)'
          }}>
            {this.state.error?.toString()}
            {'\n\n'}
            {this.state.info?.componentStack}
          </pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null, info: null })}
            style={{
              marginTop: '16px', padding: '8px 16px', background: '#fff',
              color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer'
            }}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
