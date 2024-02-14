document.addEventListener('DOMContentLoaded', function () {
  var script = document.createElement('script');
  script.src = 'https://widget.kapa.ai/kapa-widget.bundle.js';
  script.setAttribute(
    'data-website-id',
    'd902d9ae-b379-4a22-bb35-b78b4c601d3b'
  );
  script.setAttribute('data-project-name', 'Moonbeam');
  script.setAttribute('data-project-color', '#514C65');
  script.setAttribute('data-project-logo', '/images/moonbot.webp');
  script.setAttribute(
    'data-footer-tos-privacy-links',
    '[{"title": "terms of service", "url": "https://moonbeam.network/terms-of-use/"}, {"title": "privacy policy", "url": "https://moonbeam.foundation/privacy-policy/"}]'
  );
  script.async = true;
  document.head.appendChild(script);
});
