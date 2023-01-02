---
title: 'How to setup a react project with Vite'
date: 2023-01-02
---

## 1 Bootstrap a react project with vite

npm init vite
(from the proposed options select react and typescript)

npm install

change the dev script to start

## 2 Install styled components

npm i styled-components
npm i -D @types/styled-components

delete any css file

## 3 Install and configure prettier and eslint

npm i -D eslint
npm i -D --save-exact prettier
npm i -D eslint-plugin-react
npm i -D eslint-plugin-react-hooks
npm i -D @typescript-eslint/eslint-plugin@latest

copy these files from a previous project:
.eslintignore
.eslintrc.json
.prettierignore
.prettierrc

To enable format on save on vs code run ctrl/cmd + shft + p "format document with..." and select "configure default formatter", selecting prettier

## 4 Add Jest and React Testing Library

npm i -D jest jest-environment-jsdom
npm i -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm i -D @babel/preset-react @babel/preset-typescript @babel/preset-env

add

```
"test": "jest",
"test:watch": "jest --watchAll=true",
```

to scripts in package.json

add the files
babel.config.cjs

```
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
}
```

jest-setup.ts

```
import '@testing-library/jest-dom'
```

add the jest entry in the package.json

```
  "jest": {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": [
      "<rootDir>/jest-setup.ts"
    ]
  }

```

## 5 .env

Supported out of the box, variables must be prefixed with `VITE_`and accessed by `import.meta.env.VITE_XXX`

## 6 GIT

git init

### Pre-commit hook

git config --local core.hooksPath .githooks/

npm i -D pretty-quick

add

```
"pretty-quick": "pretty-quick --staged"
```

to the scripts in the package.json

create a file in ./.githooks/pre-commit
chmod 755 .githooks/pre-commit

```
#!/bin/sh

npm run pretty-quick && npm run lint
```

### Pre-push hook

create a file in ./.githooks/pre-push
chmod 755 .githooks/pre-push

```
#!/bin/sh

npm run test
```

### Commit-msg hook

npm i -D @commitlint/cli @commitlint/config-conventional

addd

```
"commitlint": "commitlint --edit $1",
```

to npm scripts in package.json

create a file in ./.githooks/commit-msg
chmod 755 .githooks/commit-msg

```
#!/bin/sh

npm run commitlint
```

create a file commitlint.config.cjs

```
module.exports = {
  extends: ['@commitlint/config-conventional'],
}
```

## 7 Ladle

npm i @ladle/react

add a story

run with
pnpm ladle serve

## Redux toolkit (optional)

npm install @reduxjs/toolkit

## React i18 Next (optional)

npm i react-i18next i18next i18next-browser-languagedetector i18next-xhr-backend

add the src/i18n.ts file and import it in the main.tsx file

add translations in the public/locales/es/translation.json file
