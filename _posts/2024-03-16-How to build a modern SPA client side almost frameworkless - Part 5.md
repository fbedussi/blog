---
title: 'How to build a modern SPA client side (almost) frameworkless - Part 5'
date: 2024-03-16
categories: Recipes
layout: post
excerpt_separator: <!--more-->
---

Welcome to the fifth and last part of this series of post where we are building a modern client side single page application using the bare minimum amount of tooling necessary. 

In the [fourth part](https://fbedussi.github.io/blog/recipes/How-to-build-a-modern-SPA-client-side-almost-frameworkless-Part-4) we basically completed our application with a zero tooling approach. In this part we'll see how to add a dev server and a bundler, thanks to Vite and some other tools. It's really easy to do and it is totally optional. Yon can start with no tool at all, and then add the ones that you need only when and if you really need them. 

<!--more-->

## Add vite

First of all we need to turn our project into an npm project, so that we'll be able to install npm modules:

```bash
npm init
```

After having replied to the usual questions, or having skipped them pressing enter, we are ready to install npm packages. So let's install Vite, that will give us a nice dev server and a bundler:

```bash
npm i vite
```

The dev server is nice because it allows us to reload the application even if we are in an inner page. Unfortunately we will not have a Hot Module Replacement feature out of the box (it works only for CSS files). To enable it [you should write some code](https://bjornlu.com/blog/hot-module-replacement-is-easy), and then find the way to omit it in the production build. This is definitely possible, but a bit outside the minimalistic philosophy that we are using here. 

The bundler is a performance improvement. With minification it reduces the total size of the code send to the user, and by bundling multiple files in one it reduces the number of requests and avoids the overhead of dependencies resolution at runtime.

To actually use vite we need to add some scripts in the `package.json`:

```json
"start": "vite",
"build": "vite build",
"preview": "vite preview", 
```

`start` will start the dev server, `build` will create che production build, `preview` is to locally preview the production build.

Now if you do a `git status` you will see that you have a huge number of new files to commit, so this is the time to add a `.gitignore` file to ignore the `node_modules` folder: 

```
node_modules/
```

Now thaw we have a bundler we can use µhtml from an npm package, instead that from the CDN. This may be better, both to remove an additional possible point of failure (the CDN) and to leverage the performance improvement of bundling. First install the package:

```bash
npm i uhtml
```

then replace all the imports from the CDN, like:

```javascript
import { render, html, signal } from 'https://cdn.jsdelivr.net/npm/uhtml/preactive.js'
```

with import from the npm package: 

```javascript
import { render, html, signal } from 'uhtml/preactive'
```

And this is all we need to do to add Vite to the project.

## Add TypeScript

We can stop here, or we can continue adding tools. If we like and need it we can easily add TypeScript to the project. Personally I would not develop any medium to large scale project without TypeScript. But the technology stack we are exploring here is probably better suited to small size projects. So it's up to you. In any case, it is really simple:

- rename all files `.js` files to `.ts`
- rename all the imports accordingly
- rename the main script file imported by the `index.html` file
- install TypeScript with `npm i -D typescript`
- add a `tsconfig.json` file to the root of the project, in the [companion repo you can find and example](https://github.com/fbedussi/frameworkless-spa-tutorial/blob/part5/tsconfig.json)

Remember that vite doesn't perform any type checks while compiling, to do it you need to add a dedicated script to the `package.json` file:

```json
"type-check": "tsc --noEmit",
```

Now you only need to add type annotations where needed, you can find an example in the [`part5` branch of the companion repo](https://github.com/fbedussi/frameworkless-spa-tutorial/tree/part5). 

## Linting and formatting

Again, we can stop here if we want, otherwise we can add a couple of useful tools, a formatter, such as `prettier` and a linter, such as `eslint`. 

Prettier is really easy to set up, install it with:

```bash
npm i -D prettier
```

And add a configuration file, such [the one in the companion repo](https://github.com/fbedussi/frameworkless-spa-tutorial/blob/part5/.prettierrc.json). 

Remember also to enable the auto formatting on save option of your editor/IDE, using prettier. On VS code run ctrl/cmd + shift + p “format document with…” and select “configure default formatter”, selecting prettier.

Now things like tabs vs spaces, use final semicolons or not and indentation are auto fixed when we save the file. Cool. 

To set up ESLint, first of all install the main package and some plugins with: 

```bash
npm i -D eslint
npm i -D eslint-plugin-import
npm i -D eslint-config-airbnb-base
```

if you installed TypesScript you also need:

```bash
npm i -D @typescript-eslint/parser
npm i -D @typescript-eslint/eslint-plugin
```

And add the configuration file, setting up the rules as you prefer ([an example in the companion repo](https://github.com/fbedussi/frameworkless-spa-tutorial/blob/part5/.eslintrc.json)).

And that's all, now ESLint will warn you in case of common mistakes, like using an undeclared variable, or having and unused parameter or import. 

## Conclusion

We are at the end of our journey. We have seen how to develop a modern, data driven, client side Single Page Application, with almost zero tooling. The developer experience of this approach is almost the same as the one you get with frameworks, the only notable exception being the absence of the Hot Module Replacement. I would dare to say that it is even better, since you can setup a basic project in a matter of seconds, and you won't waste any time setting up and maintaining a complicated tool chain. But at the same time you can add tools like bundler, TypeScript, linter and formatter if you want.

Unfortunately we cannot be 100% dependency free because the web platform still lacks two key features: a sanitization API and reactive, declarative templates. But we can get really close. Let me know your opinion in the the comments section!
