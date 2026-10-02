import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { REGISTER_URL } from '../content.js';
import { useData } from '../lib/DataContext.jsx';
import { IS_PREVIEW } from '../lib/visibility.js';
import { SHOP_ENABLED } from '../merch.js';

const LINKS = [
  ['/', 'Home'],
  ['/season', 'Season'],
  ['/hall-of-fame', 'Hall of Fame'],
  ['/players', 'Players'],
  ['/events', 'Results'],
  ['/faq', 'Rules & FAQ'],
  ...(SHOP_ENABLED ? [['/shop', 'Shop']] : [])
];

export function Brand({ light }) {
  return (
    <Link to="/" className="brand" style={light ? { color: 'var(--paper)' } : undefined}>
      <span className="hex" aria-hidden="true" />
      NYCatan
    </Link>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { model, error } = useData();
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [pathname]);

  return (
    <>
      {IS_PREVIEW && (
        <div className="preview-bar">
          <div className="wrap">
            <span><strong>Organizer preview:</strong> showing stats that are hidden from the public site.</span>
            <a href="?show=default">Back to public view</a>
          </div>
        </div>
      )}
      <header className="site-header">
        <div className="wrap">
          <Brand />
          <nav className="nav" aria-label="Main">
            {LINKS.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <span className="sample-tag">Demo: sample results</span>
            <a className="btn btn-primary" href={REGISTER_URL}>Register</a>
            <button type="button" className="menu-btn" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></svg>
            </button>
          </div>
        </div>
        <nav className="mobile-nav" hidden={!open} aria-label="Mobile">
          {LINKS.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}
        </nav>
      </header>
      <main>
        {error && <div className="wrap" style={{ paddingTop: 48 }}><p className="notice">Results could not load: {String(error.message || error)}</p></div>}
        {!error && !model && <div className="wrap" style={{ padding: '96px var(--gutter)' }}><p className="muted mono">Loading results</p></div>}
        {model && <Outlet />}
      </main>
      <footer className="site-footer">
        <div className="wrap">
          <Brand light />
          <span>Results imported from Best Coast Pairings after every event.</span>
          <span style={{ color: '#9A958C', fontSize: 13 }}>CATAN is a trademark of CATAN GmbH. Not an official CATAN site.</span>
          {!IS_PREVIEW && <a href="?show=all" style={{ color: '#9A958C', fontSize: 13 }}>Organizer preview</a>}
        </div>
      </footer>
    </>
  );
}
