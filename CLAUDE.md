# Claude instructions — Legends EOR Website

## Project log (mandatory, every request)

`PROJECT_LOG.md` is the living context file for this project.

1. **Read it at the start of a session** to know what was done and what's pending.
2. **Update it at the end of EVERY completed user request** — before finishing your turn:
   - Add/extend a dated entry under **Done log** describing what changed (keep it short, one line per change; group same-day work under one heading, mark `*(live)*` once deployed).
   - Move finished items out of **What needs to be done**; add newly discovered ones.
   - If you discover a change made outside a Claude session (WordPress edits, Zapier/Close config, deleted pages, designer assets, Cursor commits by the team), record it under **Team changes** with the date and who/what, even if nobody asked.
3. Commit the log together with the code changes of that request.

## Standing rules

- Commits are fine anytime; **NEVER `git push` unless Codi explicitly says "push"** — pushes autodeploy to DigitalOcean.
- After any dependency change: regenerate the lockfile with `npx -y npm@10 install --package-lock-only`. Never add `engines.npm` or sharp/native-optional packages.
- Every full-screen section must fit 1280×587 and 1536×~660-700 (marketing manager's laptops). Check proactively and flag issues unprompted.
- Content scraped from WordPress at runtime must have a committed snapshot fallback (see `server/data/pillars/`) — the WP team deletes pages without warning.
- Verify each deploy by polling the live site for a marker string from that change.
- Rebuilding while Codi's dev server runs breaks it (`#app-manifest` error): rebuild freely, but tell Codi to restart `npm run dev` afterwards.
