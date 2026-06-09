# Git Workflow — Genzi Studio Growth OS

Reference for day-to-day git work under the `dev → staging → main` branch flow.
Each command has a short explanation of what it does and *why* you'd use it.

---

## Branch model

```
main           ← production. Auto-deploys to genzi-studio-dashboard.vercel.app
staging        ← QA / sign-off. Mirrors prod, used before promoting to main
development    ← integration. All feature branches merge into here
└─ feature/*   ← short-lived branch per feature, bug fix, or doc change
```

**Rule:** never commit directly to `main` or `staging`. They are protected by
GitHub branch rules — you have to open a PR. `development` accepts direct
pushes but the convention is to still go through feature branches.

---

## 1. Start a new feature

```bash
git checkout development
# Switches your working tree to the development branch.

git pull --ff-only
# Pulls the latest commits from origin/development.
# --ff-only refuses to merge — if your local has diverged, it bails out so you
# can investigate rather than silently creating a merge commit.

git checkout -b feature/<short-name>
# Creates a new branch named `feature/<short-name>` based on the current
# (development) branch and switches to it. -b means "create + switch".
# Example name: feature/dark-mode-toggle, fix/sidebar-overflow, docs/onboarding.
```

---

## 2. Daily work on your feature

```bash
git status
# Shows what's changed since the last commit (modified, staged, untracked).
# Run this often — it's your "where am I?" command.

git diff
# Shows the actual line-level changes in modified files that you HAVEN'T staged
# yet. Use it before `git add` to sanity-check what you're about to commit.

git add path/to/file.ts another/file.css
# Stages the listed files for the next commit.
# Prefer naming files explicitly over `git add .` — that way you never
# accidentally commit a stray .env file or large screenshot.

git diff --staged
# Same as `git diff` but for files you've already staged.
# Use this right before committing to review exactly what's going in.

git commit -m "Short imperative summary"
# Records the staged changes as a new commit with the given message.
# Imperative voice (e.g. "Add dark mode toggle"), not past tense.

git push -u origin feature/<short-name>
# Uploads your branch to GitHub.
# -u sets the upstream so future `git push` and `git pull` know which remote
# branch this local branch tracks. You only need -u on the first push.

# Subsequent pushes:
git push
```

---

## 3. Keep your feature current with `development`

While you're working, others may merge things into `development`. Pull those
changes into your feature branch periodically so the final PR doesn't conflict.

**Option A — rebase (linear history, recommended for solo work):**

```bash
git fetch origin
# Downloads the latest refs from origin without changing your working tree.
# Safe to run anytime — it just updates your local "view" of the remote.

git rebase origin/development
# Replays your feature commits on top of the latest origin/development.
# Result: it looks like you branched off the new tip, no merge commit.
# If there are conflicts, git pauses — fix the files, `git add` them, then:
git rebase --continue
# (or `git rebase --abort` to bail out entirely)

git push --force-with-lease
# After a rebase, your local history differs from the remote — you must
# force-push. --force-with-lease refuses if someone else pushed in the
# meantime, which prevents accidentally clobbering their commits.
# Always prefer --force-with-lease over plain --force.
```

**Option B — merge (preserves history exactly):**

```bash
git fetch origin
git merge origin/development
# Creates a merge commit that brings their changes into your branch.
# Less tidy history but no force-push needed.

git push
```

Pick one approach and stick with it across the team for consistency.

---

## 4. Open a PR (feature → development)

```bash
gh pr create --base development --head feature/<short-name> \
  --title "Short, imperative title" \
  --body "What changed and why. Test plan."
# --base = the branch you want to merge INTO
# --head = the branch with your changes (usually your current branch)
# gh handles the GitHub side; no need to open a browser tab.

gh pr view --web
# Opens the PR you just created in your default browser, so you can review
# the diff visually before merging.

gh pr checks
# Lists the CI / Vercel checks running on your PR. Re-run to see status.

gh pr merge --squash
# Merges the PR (after checks pass + reviews if required).
# --squash collapses all the feature branch commits into one clean commit
# on development. Alternatives: --merge (preserves commits), --rebase
# (replays commits onto base without a merge commit).
```

After the PR is merged, clean up:

```bash
git checkout development
git pull --ff-only
# Now development includes your feature.

git branch -d feature/<short-name>
# Deletes the local branch. -d only deletes if it's fully merged
# (safety net — use -D to force-delete if you really want to drop it).

git push origin --delete feature/<short-name>
# Deletes the branch on GitHub. (Or just click "Delete branch" in the PR UI.)
```

---

## 5. Promote `development` → `staging` (when ready for QA)

```bash
gh pr create --base staging --head development \
  --title "Promote dev to staging — <date or sprint>" \
  --body "Includes: <bullet list of features in this promotion>"

# QA on the staging preview URL:
#   https://genzi-studio-dashboard-git-staging-ibrahimsatria.vercel.app
# After sign-off, merge:
gh pr merge --merge       # use --merge here (not squash) to preserve history
```

---

## 6. Promote `staging` → `main` (ship to production)

```bash
gh pr create --base main --head staging \
  --title "Release <version or date>" \
  --body "Sign-off: <who>. Changelog: <list>"

gh pr merge --merge
# Vercel auto-deploys main → production URL within ~1–2 min.
```

---

## 7. Hotfix path (urgent prod fix that can't wait)

```bash
git checkout main
git pull --ff-only

git checkout -b hotfix/<short-name>
# Branched off main (not development) so the fix is based on what's actually
# in production right now, not whatever in-flight work is on dev.

# ... fix + commit ...
git push -u origin hotfix/<short-name>

gh pr create --base main --head hotfix/<short-name> \
  --title "Hotfix: ..." --body "..."
gh pr merge --merge

# IMPORTANT — backmerge so dev and staging include the fix:
gh pr create --base staging --head main \
  --title "Backmerge hotfix into staging" --body ""
gh pr merge --merge

gh pr create --base development --head main \
  --title "Backmerge hotfix into development" --body ""
gh pr merge --merge
# Otherwise the next promotion from dev/staging would silently overwrite
# the hotfix.
```

---

## 8. Inspection cheat sheet

```bash
git status
# Working-tree state — modified, staged, untracked.

git log --oneline -10
# Last 10 commits, compact (SHA + first line of message).

git log --oneline --graph --all -20
# Same but visualises branches/merges across all refs.

git diff
# Unstaged changes (working tree vs index).

git diff --staged
# Staged changes (index vs HEAD) — what's going into the next commit.

git diff main..development
# What's on development that isn't on main yet.
# Useful before opening a promotion PR to staging.

git branch -a
# Lists all local + remote branches.

git remote -v
# Shows where `origin` actually points (handy if you have multiple remotes).

gh pr list
# All open PRs in this repo.

gh pr checks
# Status of CI/Vercel checks on the current branch's PR.

gh pr view <number>
# Read a specific PR (use --web to open in browser).

gh repo view --web
# Opens the repo on github.com.
```

---

## 9. Recovering when things go wrong

```bash
git stash
# Quickly shelf uncommitted work without committing it. Useful when you need
# to switch branches but aren't ready to commit.
git stash pop
# Brings the shelved work back.

git restore <file>
# Discards unstaged changes to a file. (Destructive — gone for good.)

git restore --staged <file>
# Un-stages a file (keeps the changes in your working tree).

git reset --soft HEAD~1
# "Un-commits" the last commit but keeps your changes staged.
# Useful when you committed too early or with a bad message — you can
# re-stage / re-commit cleanly.

git reset --hard HEAD~1
# DANGEROUS — discards the last commit AND its changes entirely.
# Only use if you're sure you don't want that work.

git reflog
# A log of every HEAD movement in the last 90 days. If you ever do something
# destructive and want to recover, this shows you the SHA you were at — you
# can `git checkout <sha>` to get back.
```

---

## 10. Things to avoid

- ❌ `git push --force` — clobbers anyone else's commits. Use `--force-with-lease`.
- ❌ Direct push to `main` or `staging` — branch protection will reject it. Always PR.
- ❌ `git add .` or `git add -A` without checking — easy way to commit secrets or large files.
- ❌ `git rebase -i` or `git add -i` in this Claude CLI session — they need interactive TTY input.
- ❌ Committing `.env.local`, `node_modules/`, `.next/`, or `temporary screenshots/` — all gitignored, double-check before pushing.
- ❌ Skipping hooks with `--no-verify` — if a pre-commit hook fails, fix the underlying issue.

---

## TL;DR for the impatient

Feature work, one-liner version:

```bash
git checkout development && git pull --ff-only
git checkout -b feature/<name>
# ... edit, commit ...
git push -u origin feature/<name>
gh pr create --base development --head feature/<name> --title "..." --body "..."
# Wait for Vercel ✓ → merge in the GitHub UI or `gh pr merge --squash`
```

That's 80% of your day. Sections 5–10 are for promotion, hotfixes, and recovery.
