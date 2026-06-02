# Tessera Demo Courses

An example [Tessera](https://tesseralearn.dev) **workspace** —
a reference project showing what courses built on the framework can look like. It
holds demo courses under `courses/`.

You can see these demos running live at **[tesseralearn.dev](https://tesseralearn.dev)**.

If you're learning Tessera or want a working starting point to copy from, this is
the repo to read. The framework's full authoring guide ships inside the dependency
at `node_modules/tessera-learn/AGENTS.md` (also linked from `CLAUDE.md`).

## The courses

The demos being added to this repo are deliberately different, so that collectively they 
exercise most of the framework, navigation modes, completion modes, export targets, custom layouts
and quiz shells, custom question widgets, persistence, theming, and accessibility.
More demos will be added over time.

### `courses/road-sign-demo` — "Road Sign Match"

A fast, timed road-sign recognition **game**. It leans on Tessera's extension
points heavily:

- Custom `layout.svelte` and `quiz.svelte` (replaces the default chrome and quiz UI)
- Custom components — countdown ring, confetti, leaderboard, sound effects, sign cards
- MUTCD road-sign SVGs and a sound-effect library under `assets/`
- **Quiz-mode completion** (`completion.mode: "quiz"`), free navigation

### `courses/solar-system-demo` — "Solar System Explorer"

A rich, content-driven tour of the planets, closer to a polished interactive
article:

- A library of custom presentation components under `lib/` (chaptered histories,
  reveal-on-scroll, comparison diagrams, a starfield, modals, a cosmic challenge)
- NASA imagery per planet under `assets/`
- **Manual completion** (`completion.mode: "manual"`), custom branding and theming

## The shared design system

`shared/` is a workspace-wide design system (`Button.svelte`, `tokens.css`) that any
course can import as `$shared`. It is bundled into each course's export at build
time, so it ships in every package with no extra wiring.

## Running a course

This is a single `pnpm` workspace: one `package.json` and one `node_modules` shared
by every course. Commands take the course name — a bare command lists the available
courses rather than picking one.

```bash
pnpm install                      # first time only

pnpm dev road-sign-demo           # dev server at http://localhost:5173
pnpm dev solar-system-demo

pnpm validate <course>            # fast structural + static a11y checks (no build)
pnpm check <course>               # validate, then the runtime axe accessibility audit
pnpm export <course>              # build the LMS/web package into the course's dist/
pnpm new <name>                   # scaffold a new course under courses/<name>/
```

The runtime accessibility audit (`pnpm check`) drives Playwright and needs a browser
binary once per machine:

```bash
pnpm exec playwright install chromium
```

You can also `cd courses/<name>` and run the bare `pnpm exec tessera <command>`.

## Layout

```
tessera-demo-courses/
├── package.json              # the one package — owns tessera-learn, svelte, scripts
├── shared/                   # design system shared across courses (imported as $shared)
├── courses/
│   ├── road-sign-demo/       # cmi5 game — custom layout, quiz, components, sfx
│   └── solar-system-demo/    # static-web content course — manual completion, custom lib/
├── CLAUDE.md / AGENTS.md     # pointers to the framework's authoring guide
└── README.md
```

## Learn more

- Website: <https://tesseralearn.dev>
- Authoring guide: `node_modules/tessera-learn/AGENTS.md` (after `pnpm install`)
- Framework on npm: <https://www.npmjs.com/package/tessera-learn>
