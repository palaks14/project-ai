import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('🚀 EduAI OS: main.jsx is executing');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ CRITICAL: Root element #root not found!');
} else {
  console.log('✅ Found #root element, rendering app...');
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
