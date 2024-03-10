import packageData from '../package.json';

export const manifest = JSON.stringify({
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
  background: {
    service_worker: 'assets/background.js',
  },
  devtools_page: 'devtools-background.html',
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*'],
      js: ['assets/content-script.js'],
      run_at: 'document_start',
    },
    {
      matches: ['http://*/*', 'https://*/*'],
      js: ['assets/client.js'],
      run_at: 'document_start',
      world: 'MAIN',
    },
  ],
  permissions: ['tabs'],
});
