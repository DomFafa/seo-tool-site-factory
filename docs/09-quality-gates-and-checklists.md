# 09 — Quality Gates and Checklists

## Gate summary

```txt
Build Gate  -> can the site build safely?
SEO Gate    -> can the site be indexable?
Content Gate-> is content approved and useful?
Tool Gate   -> does the tool actually work?
Ads Gate    -> can ads safely load?
Deploy Gate -> can production deploy go live?
```

## Build Gate

Required:

- `SITE_ID` present
- `SITE_ID` known
- selected site config valid
- primary tool known
- duplicate domains absent
- selected content exists
- selected messages exist
- site lifecycle valid

Blocks:

- missing config
- unknown tool
- invalid locale
- duplicate domain
- selected build leaking another site's content

## SEO Gate

Required:

- title
- description
- canonical
- robots policy
- sitemap generation
- hreflang closure for localized pages
- stable lastModified
- approved content for indexable pages

Blocks:

- no title/description
- invalid canonical
- noindex page in sitemap
- unapproved content marked indexable
- fake localized pages

## Content Gate

Required:

- home content for default locale
- clear tool explanation
- usage steps
- examples
- FAQ/troubleshooting when relevant
- privacy/limitations where relevant
- human review for AI-assisted text

Blocks:

- copied content
- thin page with only tool and ads
- bulk machine translation without review
- guide unrelated to primary tool

## Tool Gate

Required:

- tool spec exists
- happy path tested
- error path tested
- mobile usability tested
- max input constraints enforced
- privacy behavior shown to user

Blocks:

- fake/misleading tool
- no output
- no error handling
- analytics contains raw user content

## Ads Gate

Required:

- site lifecycle monetizable
- content value sufficient
- ad labels not misleading
- no ads near primary action buttons
- no ads blocking tool use
- no ads on draft/noindex/under-construction pages

Blocks:

- ads beside download/copy/start/convert buttons
- ads visually disguised as UI
- ads before usable tool content

## Deploy Gate

Required:

- preview deploy passes
- production domain configured
- secrets present
- homepage 200
- robots 200
- sitemap 200
- canonical host correct
- selected-site identity verified

Blocks:

- wrong domain
- wrong sitemap host
- wrong robots policy
- missing secret for enabled feature

## CI Gate

Every pull request should run:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm site check --all
pnpm site build typing-speed-test
pnpm site build convert-image-to-png
```

## Site launch status transition

```txt
draft -> validated -> preview -> indexable -> monetizable -> launched
```

Do not skip `validated` or `preview`.
