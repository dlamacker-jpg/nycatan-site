import { useMemo, useState } from 'react';
import { FAQ } from '../faq.js';
import { OFFICIAL_RULES_URL, REGISTER_URL } from '../content.js';

export default function Faq() {
  const [q, setQ] = useState('');
  const sections = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return FAQ;
    return FAQ.map((sec) => ({ ...sec, items: sec.items.filter((i) => (i.q + ' ' + i.a).toLowerCase().includes(s)) })).filter((sec) => sec.items.length);
  }, [q]);

  return (
    <div className="wrap">
      <div className="page-head">
        <div className="eyebrow">Rules and FAQ</div>
        <h1>Read this before you play</h1>
        <p>Everything new players ask, in one place. NYCatan follows the official <a href={OFFICIAL_RULES_URL} target="_blank" rel="noreferrer">CATAN Championship tournament rules</a>. This page summarizes them. If the two ever disagree, the official rules and the judge win.</p>
      </div>
      <label htmlFor="faq-search" className="mono muted" style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>Search the FAQ</label>
      <input id="faq-search" className="search" type="search" placeholder="Try: robber, trade, refund" value={q} onChange={(e) => setQ(e.target.value)} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48, marginTop: 40, maxWidth: 880 }}>
        {sections.map((sec) => (
          <section key={sec.section}>
            <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 12 }}>{sec.section}</h2>
            {sec.items.map((i) => (
              <details key={i.q} className="faq-item" open={!!q.trim()}>
                <summary>{i.q}</summary>
                <p className={/\[ORGANIZER/.test(i.a) ? 'faq-todo' : undefined}>{i.a}</p>
              </details>
            ))}
          </section>
        ))}
        {!sections.length && <p className="muted">Nothing matches "{q}". Ask at check-in, or check the official rules.</p>}
      </div>
      <div className="card" style={{ marginTop: 56, maxWidth: 880, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div>
          <strong style={{ fontSize: 18 }}>Ready to play?</strong>
          <p className="muted" style={{ marginTop: 4 }}>New players: read this page, then bring questions to the short Q&amp;A before round one.</p>
        </div>
        <a className="btn btn-primary" href={REGISTER_URL}>Register</a>
      </div>
    </div>
  );
}
