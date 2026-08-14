const DevBoxComponents = (() => {
  'use strict';

  function relatedTools(links) {
    const items = links.map(l => `<a href="${l.href}">${l.label}</a>`).join('');
    return `<section class="related-tools">
      <h3>Need something else?</h3>
      ${items}
    </section>`;
  }

  function faq(items) {
    const details = items.map((q, i) => `<details>
      <summary>${q.q}</summary>
      <div class="faq-body">${q.a}</div>
    </details>`).join('');
    return `<section class="faq">
      <h3>Frequently Asked Questions</h3>
      ${details}
    </section>`;
  }

  function howItWorks(steps) {
    const html = steps.map(s => `<div class="step">
      <div class="step-num">${s.n}</div>
      <h4>${s.title}</h4>
      <p>${s.desc}</p>
    </div>`).join('');
    return `<section class="how-it-works">
      <h3>How it works</h3>
      ${html}
    </section>`;
  }

  function privacyBar() {
    return `<div class="privacy-bar">🔒 Your data never leaves your device</div>`;
  }

  function jsonLd(obj) {
    return `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
  }

  function schemaSoftwareApplication(name, description, url) {
    return {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name,
      description,
      url,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    };
  }

  return { relatedTools, faq, howItWorks, privacyBar, jsonLd, schemaSoftwareApplication };
})();
