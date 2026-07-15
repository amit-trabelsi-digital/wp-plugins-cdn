# Plugin Publishing Contract

## Manifest

Every release writes `public/<slug>/plugin-info.json` with this shape:

```json
{
  "schema_version": 1,
  "name": "Plugin name",
  "slug": "plugin-slug",
  "plugin_file": "plugin-slug/plugin-slug.php",
  "version": "1.2.3",
  "requires": "5.8",
  "tested": "6.8",
  "requires_php": "7.4",
  "last_updated": "2026-07-15 00:00:00",
  "package": "https://updates.amiteam.io/plugin-slug/download",
  "download_url": "https://updates.amiteam.io/plugin-slug/download"
}
```

The version in the manifest, plugin header, PHP version constant and Git tag must be identical.

## Plugin Requirements

Every plugin must include a private CDN updater. It must register the WordPress `update_plugins_updates.amiteam.io` filter, fetch the manifest, compare versions and return the package URL to WordPress.

`Update URI` alone prevents WordPress.org collisions; it does not fetch the manifest. See the updater implementation in a published plugin for the reference pattern.

## GitHub Actions Requirements

The publishing workflow must have:

```yaml
permissions:
  contents: write
```

It must run only on `v*.*.*` tags and use `AT_CDN_REPO_TOKEN` to check out and push this repository.

## Release Verification

After publication, verify:

```bash
curl --fail https://updates.amiteam.io/<slug>/plugin-info.json
curl --fail --head https://updates.amiteam.io/<slug>/download
```

Then force a WordPress update check and confirm that the update package points to `updates.amiteam.io`.
