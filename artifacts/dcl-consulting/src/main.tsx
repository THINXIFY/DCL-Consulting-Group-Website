import { createRoot } from 'react-dom/client';
import { setBaseUrl } from '@workspace/api-client-react';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';

import './index.css';

// Generated API calls are always relative to "/api" (see lib/api-spec's
// orval.config.ts baseUrl). That's correct as-is when the frontend and
// api-server share an origin (local dev, via the Vite proxy below, or any
// single-domain deployment) - but when they're deployed to separate
// domains (e.g. the frontend on Render's static site, the API on
// api.dcl-consulting-group.com), relative paths would resolve against the
// frontend's own origin instead. VITE_API_BASE_URL, when set at build
// time, prepends the real API origin to every request; left unset, this
// is a no-op and nothing changes.
if (import.meta.env.VITE_API_BASE_URL) {
  setBaseUrl(import.meta.env.VITE_API_BASE_URL);
}

createRoot(document.getElementById('root')!, {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error, errorInfo) => {
    console.error(error, errorInfo.componentStack);
  },
}).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
