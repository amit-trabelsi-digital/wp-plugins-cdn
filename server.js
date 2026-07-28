const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PLUGINS_ROOT = path.join(__dirname, 'public');

app.disable('x-powered-by');
app.use(cors({
  origin: '*',
  methods: ['GET', 'HEAD'],
  allowedHeaders: ['Accept', 'Cache-Control', 'If-None-Match', 'If-Modified-Since'],
  maxAge: 86400,
}));
app.use((req, res, next) => {
  res.set({
    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; sandbox",
    'Cross-Origin-Resource-Policy': 'cross-origin',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  });
  next();
});

function isValidSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function pluginDirectory(slug) {
  return path.join(PLUGINS_ROOT, slug);
}

async function getPluginManifest(slug) {
  if (!isValidSlug(slug)) {
    return null;
  }

  try {
    const manifestPath = path.join(pluginDirectory(slug), 'plugin-info.json');
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    return manifest;
  } catch (error) {
    return null;
  }
}

function normalizeManifest(manifest) {
  if (manifest && manifest.version) {
    return manifest;
  }

  if (!manifest || typeof manifest !== 'object') {
    return null;
  }

  const pluginFile = Object.keys(manifest).find((key) => key.endsWith('.php'));
  if (!pluginFile || !manifest[pluginFile] || typeof manifest[pluginFile] !== 'object') {
    return null;
  }

  return { ...manifest[pluginFile], plugin_file: pluginFile };
}

function validateManifest(slug, rawManifest) {
  const manifest = normalizeManifest(rawManifest);
  const expectedPackage = `https://updates.amiteam.io/${slug}/download`;

  if (!manifest ||
      manifest.schema_version !== 1 ||
      manifest.slug !== slug ||
      !/^[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?$/.test(manifest.version || '') ||
      !/^[a-z0-9-]+\/[a-z0-9-]+\.php$/.test(manifest.plugin_file || '') ||
      manifest.package !== expectedPackage ||
      manifest.download_url !== expectedPackage) {
    return null;
  }

  return manifest;
}

async function sendPluginManifest(req, res) {
  const manifest = validateManifest(
    req.params.plugin,
    await getPluginManifest(req.params.plugin),
  );
  if (!manifest) {
    return res.status(404).json({ error: 'Plugin manifest not found' });
  }

  res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
  return res.json(manifest);
}

async function listPlugins() {
  const entries = await fs.readdir(PLUGINS_ROOT, { withFileTypes: true });
  const plugins = await Promise.all(entries
    .filter((entry) => entry.isDirectory() && isValidSlug(entry.name))
    .map(async (entry) => {
      const manifest = validateManifest(entry.name, await getPluginManifest(entry.name));
      if (!manifest) {
        return null;
      }

      return {
        slug: entry.name,
        version: manifest.version || null,
        url: `/${entry.name}`,
      };
    }));

  return plugins.filter(Boolean);
}

app.get('/', async (req, res) => {
  const plugins = await listPlugins();
  res.json({
    status: 'ok',
    name: 'Amit Trabelsi - WordPress Plugins Distribution Server',
    description: 'Private CDN for WordPress plugin updates',
    endpoints: {
      health: '/health',
      plugins: '/plugins',
      pluginInfo: '/:plugin/plugin-info.json',
      download: '/:plugin/download',
    },
    plugins,
  });
});

app.get('/health', async (req, res) => {
  try {
    const plugins = await listPlugins();
    res.json({ status: 'ok', plugins: plugins.length });
  } catch (error) {
    res.status(503).json({ status: 'error', message: 'Plugin storage is unavailable' });
  }
});

app.get('/plugins', async (req, res, next) => {
  try {
    res.json({ plugins: await listPlugins() });
  } catch (error) {
    next(error);
  }
});

app.get('/:plugin/info.json', sendPluginManifest);
app.get('/:plugin/plugin-info.json', sendPluginManifest);

app.get('/:plugin/download', async (req, res) => {
  const slug = req.params.plugin;
  const manifest = validateManifest(slug, await getPluginManifest(slug));
  const zipPath = path.join(pluginDirectory(slug), `${slug}.zip`);

  if (!manifest || !isValidSlug(slug)) {
    return res.status(404).json({ error: 'Plugin package not found' });
  }

  try {
    await fs.access(zipPath);
    res.set('Cache-Control', 'public, max-age=86400, immutable');
    return res.download(zipPath, `${slug}.zip`);
  } catch (error) {
    return res.status(404).json({ error: 'Plugin package not found' });
  }
});

app.use(express.static(PLUGINS_ROOT, {
  index: false,
  maxAge: '5m',
}));

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`WordPress Plugins CDN server running on port ${PORT}`);
});
