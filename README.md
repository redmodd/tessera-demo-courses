# Tessera Demo Courses

An example [Tessera](https://tesseralearn.dev) **workspace**: 
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

- **`road-sign-demo`** — a timed road-sign recognition game. Custom `layout.svelte`
  and `quiz.svelte`, quiz-mode completion.
- **`solar-system-demo`** — a polished interactive article on the planets. Custom
  presentation components, NASA imagery, manual completion.
- **`zoo-quest`** — a tile-based overworld you walk around to fill a "Zoodex".
  Game engine and procedural SVG art under `lib/`, persistence, manual completion.

## Running a course

This is a single `pnpm` workspace: one `package.json` and one `node_modules` shared
by every course. Commands take the course name — a bare command lists the available
courses rather than picking one.

```bash
pnpm install                      # first time only

pnpm dev road-sign-demo           # dev server at http://localhost:5173
pnpm dev solar-system-demo
pnpm dev zoo-quest

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
│   ├── road-sign-demo/       # custom layout, quiz, components, sfx
│   ├── solar-system-demo/    # manual completion, custom lib/
│   └── zoo-quest/            # tile-based overworld game, persistence, custom engine
├── CLAUDE.md / AGENTS.md     # pointers to the framework's authoring guide
└── README.md
```

## Learn more

- Website: <https://tesseralearn.dev>
- Authoring guide: `node_modules/tessera-learn/AGENTS.md` (after `pnpm install`)
- Framework on npm: <https://www.npmjs.com/package/tessera-learn>
