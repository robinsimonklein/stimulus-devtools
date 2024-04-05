import packageData from '../package.json';

const manifest: Record<string, unknown> = {
  manifest_version: 3,
  name: packageData.displayName || packageData.name,
  version: packageData.version,
  description: packageData.description,
  icons: {
    '16': 'images/icon-16.png',
    '32': 'images/icon-34.png',
    '48': 'images/icon-48.png',
    '128': 'images/icon-128.png',
  },
  action: {
    default_icons: {
      '16': 'images/icon-16.png',
      '32': 'images/icon-34.png',
      '48': 'images/icon-48.png',
      '128': 'images/icon-128.png',
    },
    default_title: 'Stimulus DevTools',
    default_popup: 'popup.html',
  },
  devtools_page: 'devtools-background.html',
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['assets/bridge.js'],
      run_at: 'document_start',
    },
    {
      matches: ['<all_urls>'],
      js: ['assets/detector.js'],
      run_at: 'document_start',
      world: 'MAIN',
    },
  ],
  web_accessible_resources: [{ resources: ['assets/client.js'], matches: ['<all_urls>'] }],
  content_security_policy: {
    extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';",
  },
  host_permissions: ['<all_urls>'],
  permissions: ['tabs', 'storage'],
};

export default JSON.stringify(manifest);
