import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

/**
 * A crash must never be a silent white screen — on a phone at the entrance
 * gate that reads as "the system is down". Show what happened and offer a
 * cache-busting reload instead.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#F7F9FB', fontFamily: '"Google Sans", system-ui, sans-serif' }}>
        <div style={{ maxWidth: 420, textAlign: 'center' }}>
          <h1 style={{ fontSize: 22, color: '#172433', marginBottom: 8 }}>Something went wrong</h1>
          <p style={{ fontSize: 14, color: '#445466', marginBottom: 6 }}>
            The page hit an error. Reloading usually fixes it. Your data is safe on the server.
          </p>
          <p style={{ fontSize: 12, color: '#6D7B89', marginBottom: 20, wordBreak: 'break-word' }}>
            {String(this.state.error?.message || this.state.error)}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{ minHeight: 44, padding: '10px 24px', borderRadius: 6, border: 0, background: '#1577B8', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            Reload the page
          </button>
        </div>
      </div>
    );
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
