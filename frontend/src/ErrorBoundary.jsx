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
    console.error('AquaVault Crash:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#000000', padding: '40px', textAlign: 'center', gap: 16
        }}>
          <div style={{ fontSize: 48 }}>⚠️</div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#FF6666' }}>
            Something went wrong
          </h2>
          <pre style={{
            background: '#111', padding: '16px', borderRadius: '8px',
            fontSize: '11px', color: '#FF4757', whiteSpace: 'pre-wrap',
            border: '1px solid rgba(255,71,87,0.3)', maxWidth: 500,
            textAlign: 'left', maxHeight: 200, overflowY: 'auto'
          }}>
            {this.state.error?.toString()}
            {'\n\n'}
            {this.state.info?.componentStack?.slice(0, 300)}
          </pre>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => this.setState({ hasError: false, error: null, info: null })}
              style={{
                padding: '10px 20px', background: '#FFFFFF',
                color: '#000', border: 'none', borderRadius: '8px',
                cursor: 'pointer', fontWeight: 700
              }}>
              Try Again
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('aquavault_session');
                window.location.reload();
              }}
              style={{
                padding: '10px 20px', background: 'rgba(255,102,102,0.15)',
                color: '#FF6666', border: '1px solid rgba(255,102,102,0.3)',
                borderRadius: '8px', cursor: 'pointer', fontWeight: 700
              }}>
              Log Out &amp; Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
