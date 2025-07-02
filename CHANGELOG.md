## [1.0.1] – 2025-07-02

### Security

- Upgraded `vite` to v7.0.0 to patch `server.fs.deny` bypass vulnerability
- Prevents possible disclosure of `.env` or other sensitive files when dev server is exposed with `--host`
- Resolves GitHub Dependabot alert
