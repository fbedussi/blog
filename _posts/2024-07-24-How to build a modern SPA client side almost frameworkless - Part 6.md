---
title: 'How to build a modern SPA client side (almost) frameworkless - Part 6'
date: 2024-07-24
categories: Recipes
layout: post
excerpt_separator: <!--more-->
---

Hi all, this is a bonus post on the "How to build a modern SPA client side (almost) frameworkless" series. Thanks to a talk by [Massimo Artizzu](https://www.linkedin.com/in/massimoartizzu/) I learned that [we can use JsDoc to have a sort of type system without using TypeScript](https://github.com/MaxArt2501/typescriptless-types-talk/tree/main). Of course I knew JsDoc, but I've always used it just to add comments on functions. As it turns out it can do much more, and, at least for simple project, can replace TypeScript.

 <!--more-->

The big pro is that in this way you can remain buildless, but you can have some type safety as well. Be buildless and (almost) dependency free is a big advantage in terms of security, because it minimize the risk of a supply chain attack, and in terms of maintainability, because the code that you are writing and running right now will run and be editable even in 10 years from now. There is a tradeoff between the power that a build chain and dependencies give you and the maintainability of the code base. Every project has its own sweet spot on this continuum. If you have a simple project that will live for a long time, be buildless and dependency free can be a big win.

The major con of this solution is that the type check is entirely delegated to the IDE, VS Code in this case. Since there isn't a compiler, there isn't a command line tool that che quickly spot type errors.

To enable the type checking by VS code you need to add a `jsconfig.json` file in the root of the project with this content: 

```json
{
  "compilerOptions": {
    "checkJs": true,
    "lib": ["ESNext", "DOM"],
  },
  "exclude": ["node_modules", "**/node_modules/*"]
}
```

the `checkJs` options enables the type checking on the js files, the other options are basically the same as the `tsconfig.json` file ones. 

Then you can declare types: 

```js
/**
 * @typedef {Object} AddNotePayload
 * @property {string} title
 * @property {string} text
 */

/**
 * @typedef {AddNotePayload & {id: string}} Note 
 */
```

and use them, both for variables:
```js
/**
 * @type {Note[]}
 */
const savedData = savedDataJson ? JSON.parse(savedDataJson) : []
```

and for functions:

```js
/**
 * @param {AddNotePayload} note 
 */
export const addNote = async (note) => {
  const updatedData = await notes.value.concat({
    id: crypto.randomUUID(),
    ...note,
  })
  notes.value = updatedData
  saveUpdatedData(updatedData)
}
```

The inference works as in TypeScript, so, for instance, you can explicitly declare the return type of a function:

```js
/**
 * 
 * @param {TemplateStringsArray} strings 
 * @param  {...string} values 
 * @returns {void}
 */
export const css = (strings, ...values) => {
```

or leave the engine infer that: 

![](https://fbedussi.github.io/blog/assets/images/spa-fl-jsdoc-inference.png)

For further details you can read the [Massimiliano's presentation](https://github.com/MaxArt2501/typescriptless-types-talk/tree/main), or check out the the [dedicated branch on the demo repo](https://github.com/fbedussi/frameworkless-spa-tutorial/tree/part4_jsdoc).
