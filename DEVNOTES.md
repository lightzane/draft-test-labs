# Development

## When changing repository

Update the following line in this file: [feature-card.tsx](<./src/components/(welcome)/feature-card.tsx#L7>)

## Before Pushing

> **Github Actions** is implemented to automate the workflow for **Github Pages** deployment

1. Update [`package.json`](./package.json#L4) version everytime before pushing otherwise **husky** should fail on `pre-commit`

> **Github Actions** is implemented to automate the workflow for automating release tags

## Dev Learnings

- [Reminder on updating package version](#update-package-version-reminder)

### Update Package Version reminder

**Husky** will check if `package.json` is NOT updated on `pre-commit`.
([See reference](./.husky/pre-commit))

#### How Husky was Setup?

```bash
npm i -D husky
npx husky init
```

Reference: https://typicode.github.io/husky/get-started.html

### Auto release tag

We can always forget to add `git tag` (or release tags when on **Github**).

Manually, we run the following commands to create a **tag**

```bash
git tag $new_tag
git push origin $new_tag # will throw error if tag already exists
# git push origin $new_tag -f # forcefully override existing tag
```

To automate this, see [release-tag.yml](./.github/workflows/release-tag.yml)

### Infinite horizontal scroll with animation

See development in [scrolly.tsx](./src/components/scrolly.tsx) and [scrolly.module.css](./src/components/scrolly.module.css)

See usage in [login.tsx](./src/app/pages/login.tsx#L47-L68)

### Parallax scroll effect

See [welcome.tsx](./src/welcome.tsx#L50)
