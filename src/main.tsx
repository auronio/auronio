import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Auronio dinamične QR povezave (auronio.com/r/slug): Render statična stran
// nezanesljivo obravnava te poti preko Redirects/Rewrites (privzeto vedno servira
// index.html za neznane poti), zato preusmeritev raje izvedemo TUKAJ, znotraj same
// aplikacije, takoj ob nalaganju — preden se sploh izriše React vmesnik.
// To uporablja isto Supabase Edge Function, ki že deluje pravilno pri neposrednem klicu.
const REDIRECT_PATH_MATCH = window.location.pathname.match(/^\/r\/(.+)$/);

if (REDIRECT_PATH_MATCH) {
  const slug = REDIRECT_PATH_MATCH[1];
  const functionUrl = `https://qfqekeeoppgsvyixqhkt.supabase.co/functions/v1/quick-endpoint/${encodeURIComponent(slug)}`;
  window.location.replace(functionUrl);
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
