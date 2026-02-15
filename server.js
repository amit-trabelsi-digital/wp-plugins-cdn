const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    name: 'Amit Trabelsi - WordPress Plugins Distribution Server',
    description: 'Private CDN for WordPress plugin updates',
    owner: 'Amit Trabelsi',
    contact: 'amit@trabel.si',
    website: 'https://amit-trabelsi.co.il',
    endpoints: {
      health: '/health',
      plugins: '/plugins',
      pluginInfo: '/:plugin/plugin-info.json'
    }
  });
});

// JSON endpoint for plugin info (support both formats)
app.get('/:plugin/info.json', (req, res) => {
  const pluginName = req.params.plugin;
  res.sendFile(path.join(__dirname, 'public', pluginName, 'plugin-info.json'));
});

app.get('/:plugin/plugin-info.json', (req, res) => {
  const pluginName = req.params.plugin;
  res.sendFile(path.join(__dirname, 'public', pluginName, 'plugin-info.json'));
});

// ZIP download endpoint
app.get('/:plugin/download', (req, res) => {
  const pluginName = req.params.plugin;
  res.sendFile(path.join(__dirname, 'public', pluginName, `${pluginName}.zip`));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'WordPress Plugins CDN is running' });
});

// List all plugins
app.get('/plugins', (req, res) => {
  res.json({
    plugins: [
      {
        name: 'at-agency-sites-manager',
        url: `${req.protocol}://${req.get('host')}/at-agency-sites-manager`
      },
      {
        name: 'wordpress-ai-assistant',
        url: `${req.protocol}://${req.get('host')}/wordpress-ai-assistant`
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`WordPress Plugins CDN server running on port ${PORT}`);
});
