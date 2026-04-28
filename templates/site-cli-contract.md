# Site CLI Contract

## Commands

```bash
pnpm site list
pnpm site check <site-id>
pnpm site check --all
pnpm site build <site-id>
pnpm site deploy <site-id> --preview
pnpm site deploy <site-id> --production
pnpm site verify <site-id>
pnpm site report
```

## `site check`

Must validate:

- config schema
- lifecycle state
- domains
- locales
- content
- messages
- SEO data
- ads policy
- analytics config
- tool spec
- deployment config

## Exit codes

- `0`: pass
- `1`: blocking error
- `2`: warnings only, if command is configured to treat warnings as non-blocking

## Output

Human-readable table by default. JSON with `--json`.
