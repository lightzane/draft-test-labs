# Development

## When changing repository

Update the following line in this file: [feature-card.tsx](<./src/components/(welcome)/feature-card.tsx#L7>)

## Before Pushing

> **Github Actions** is implemented to automate the workflow for **Github Pages** deployment

1. Update [`package.json`](./package.json#L4) version everytime before pushing
2. Run `npm i --package-lock-only` this will reflect the version update in `package-lock.json`
   without updating the version of other dependencies.

> **Github Actions** is implemented to automate the workflow for automating release tags
