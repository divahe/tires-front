# tires-front

- This is a simple demo app without user login that enables the users to book tire change times in different masteries.
- Development server is running on `http://localhost:5173/`.
- Project needs a backend server from `https://github.com/divahe/tires-backend.git`
- NB: project needs more unit tests, whick were not added due to time shortage.

## Project Setup

Ensure that you have the following tools installed on your system:

- Node.js (version 20 or higher)
- npm or Yarn

Clone git repository:

- [git clone https://github.com/divahe/tires-front]
- cd tires-front


```sh
npm install
```
or 

```sh
yarn install
```
Project starts with

```sh
npm run dev
```
or
```sh
yarn dev
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
