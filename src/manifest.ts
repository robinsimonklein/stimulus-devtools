import packageData from '../package.json';

const isDev = process.env.NODE_ENV !== 'production';

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
  permissions: ['tabs', 'storage'],
};

if (isDev)
  manifest['background'] = {
    service_worker: 'assets/background.js',
  };

export default JSON.stringify(manifest);
