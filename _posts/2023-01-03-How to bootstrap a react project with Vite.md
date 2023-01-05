---
title: 'How to setup a react project with Vite'
date: 2023-01-02
categories: Recipes
layout: post
excerpt_separator: <!--more-->
---

I've been using [Create React App](https://create-react-app.dev/) for years now. I didn't want to deal with the Webpack configuration. Usually I'm not a fan of tooling, I just want to code and get things done.

More often than not you need to apply some customization to Create React App, and that is not possible out of the box. You need to use tools like [Craco](https://craco.js.org/) or [React App Rewired](https://github.com/timarney/react-app-rewired). This can be troublesome because they are not always in sync with the CRA releases, but usually, with a minimum effort, you can bend CRA just enough to suite your needs.

But in the last six months I hit a limitation of Create React App that I could not override without ejecting. CRA doesn't allow imports outside of the `src` folder, and the dev server doesn't update when a dependency in the `node_modules` folder changes. This is a problem when you work in a monorepo project. For instance, if you have a monorepo with this folders:

```
  |
  +- Packages
    +- Components
    +- App1
    +- App2
```

You want your dev server to update App1 and App2 whenever the components they import from the `Components` folder change.

I couldn't find a way to achieve this with CRA, if you know how, please drop me a note in comments.

So I began experimenting alternative solutions to CRA. I played with [Vite](https://vitejs.dev) in a project using [solid js](https://www.solidjs.com/) and I decided to give it a try.

I discovered that bootstrapping a React project with vite is quite easy and, all in all doesn't require much more work than with CRA.

This is my recipe. It is quite long, but the only actually required step is the first one. All the others are optional and depends on your desired setup. Almost all of them, except the 3 and 4, are required also with CRA.

<!--more-->

## 1 Bootstrap a react project with vite

This is the only required step, that will bootstrap a fully functioning React application, just like Create React App does.

`npm init vite`
(from the proposed options select react and typescript)

`npm install`

I prefer to change the dev script to start, for sake of habit and to be able to omit the `run` command invoking the script. Then you can run the dev server with:

`npm start`

## 2 Install styled components

Using styled components you don't need any CSS pre/post-processor, and no related tool or configuration.

Alternatively, [CSS modules are supported out of the box by Vite](https://vitejs.dev/guide/features.html#css-modules).

`npm i styled-components`
`npm i -D @types/styled-components`

And delete any css file eventually present in the bootstrapped project.

## 3 Install and configure prettier and eslint

I'm tired of discussion on how to format code. In the projects I manage the team can adopt whatever format rules they like, as long as it can be automatically enforced by [prettier](https://prettier.io).

[Eslint](https://eslint.org) is a super useful tool to capture possible errors at write time. Along with TypeScript is the foundation of the [testing trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications).

`npm i -D eslint`
`npm i -D --save-exact prettier`
`npm i -D eslint-plugin-react`
`npm i -D eslint-plugin-react-hooks`
`npm i -D @typescript-eslint/eslint-plugin@latest`

Create or [copy these files from a previous project](https://github.com/fbedussi/vite-react-bootstrap):
.eslintignore
.eslintrc.json
.prettierignore
.prettierrc

To enable format on save on vs code run ctrl/cmd + shift + p "format document with..." and select "configure default formatter", selecting prettier. On my machine this is necessary, even if Prettier is already configured as the default formatter.

## 4 Add Jest and React Testing Library

[Jest](https://jestjs.io/) is my go to choice for JavaScript testing, and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) is the best tool I know to test React applications.

`npm i -D jest jest-environment-jsdom`
`npm i -D @testing-library/react @testing-library/jest-dom @testing-library/user-event`

add

```JSON
"test": "jest",
"test:watch": "jest --watchAll=true",
```

to scripts in `package.json`.

Unfortunately jest needs Babel to run:
`npm i -D @babel/preset-react @babel/preset-typescript @babel/preset-env`

add the files

`babel.config.cjs` with this content:

```JS
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

`jest-setup.ts` with this content:

```TS
import '@testing-library/jest-dom'
```

add the jest entry in the package.json

```JSON
  "jest": {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": [
      "<rootDir>/jest-setup.ts"
    ]
  }

```

## 5 .env

[The .env files are supported out of the box by Vite](https://vitejs.dev/guide/env-and-mode.html), variables must be prefixed with `VITE_`and accessed by `import.meta.env.VITE_XXX`.

## 6 GIT

I don't need to introduce Git, do I?

`git init`

### 6.1 Pre-commit hook

By default git hooks are stored in the `.git/hooks` folder, where they can not be versioned. To change the folder (e.g. to `.githooks`):

`git config --local core.hooksPath .githooks/`

Then you can install [pretty quick](https://github.com/azz/pretty-quick), to run [Prettier](https://prettier.io/) on staged files:

`npm i -D pretty-quick`

add

```JSON
"pretty-quick": "pretty-quick --staged"
```

to the scripts in the package.json

create the file `./.githooks/pre-commit` with this content:

```SH
#!/bin/sh

npm run pretty-quick && npm run lint
```

and make it executable:

`chmod 755 .githooks/pre-commit`

### 6.2 Pre-push hook

create the file `./.githooks/pre-push` with this content:

```SH
#!/bin/sh

npm run test
```

and make it executable:

`chmod 755 .githooks/pre-push`

### 6.3 Commit-msg hook

Install [Commitlint](https://commitlint.js.org) and the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0) conventions:

`npm i -D @commitlint/cli @commitlint/config-conventional`

add

```JSON
"commitlint": "commitlint --edit $1",
```

to npm scripts in package.json

create the file `./.githooks/commit-msg` with this content:

```SH
#!/bin/sh

npm run commitlint
```

and make it executable:

`chmod 755 .githooks/commit-msg`

create the file `commitlint.config.cjs`

with this content:

```JS
module.exports = {
  extends: ['@commitlint/config-conventional'],
}
```

## 7 Ladle

I struggled for years with the Storybook installation, configuration and maintenance. Countless times I found it broken after an update in the project dependencies. The last time I tried to install it in an existing project it broke the project's build pipeline.

I decided then enoughs is enoughs and looked for an alternative. [Ladle](https://ladle.dev) is a drop in replacement for Storybook, that uses [the same story format](https://github.com/ComponentDriven/csf) and runs on Vite. Is super easy to install and run. Hope it will last the test of time.

`npm i @ladle/react`

[add a story](https://ladle.dev/docs/setup#add-a-story)

run with
`pnpm ladle serve`

You will notice that the installation added just one single dependency to your `package.json` file.

## 8. Redux toolkit

I love [Redux](https://redux.js.org), so I really love [Redux Toolkit](https://redux-toolkit.js.org/), that solves one of the few redux issue, verbosity, and I really really love [RTK Query](https://redux-toolkit.js.org/rtk-query/overview), that helps handling API calls. So:

`npm install @reduxjs/toolkit`

## 9. React i18 Next

Usually an application needs to be multilingual. [React i18 next](https://react.i18next.com) is the de facto standard to handle multilanguage in React:

`npm i react-i18next i18next i18next-browser-languagedetector i18next-xhr-backend`

add the [`src/i18n.ts`](https://github.com/fbedussi/vite-react-bootstrap/blob/master/src/i18n.ts) file and import it in the `main.tsx` file

add translations in the `public/locales/en/translation.json` file

## 10. Enjoy

So here we are, the setup is ended. You now have a fast starting, fully fledged, React Application, with everything you need to develope a pro app.
