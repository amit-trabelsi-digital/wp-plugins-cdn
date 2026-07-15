# AT Private WordPress Plugin CDN

Central distribution server for every first-party AT WordPress plugin.

Each plugin is published as two files under `public/<plugin-slug>/`:

```text
public/<plugin-slug>/
├── plugin-info.json
└── <plugin-slug>.zip
```

The Railway service serves those files through a stable public interface:

- `GET /health`
- `GET /plugins`
- `GET /<plugin-slug>/plugin-info.json`
- `GET /<plugin-slug>/download`

`plugin-info.json` is the canonical release manifest. Its `package` field must always point to the CDN download endpoint, not to a GitHub release.

## Publishing model

Plugin repositories publish only from a semantic-version tag (`vX.Y.Z`). The release workflow must:

1. Validate that the tag matches the plugin header version.
2. Build a ZIP whose top-level directory is the plugin slug.
3. Generate the canonical manifest.
4. Commit the ZIP and manifest to this repository.
5. Verify the public manifest version and ZIP endpoint after Railway deploys.

The plugin repository needs the `AT_CDN_REPO_TOKEN` Actions secret. Use a fine-grained GitHub token limited to this repository with `Contents: Read and write`.

See [PUBLISHING.md](PUBLISHING.md) for the complete contract and release checklist.
