---
title: 'The pros and cons of Elm as a Front End language'
date: 2024-08-09
categories: Opinions
layout: post
excerpt_separator: <!--more-->
---

Everybody knows that there are a lot of JavaScript Front End frameworks. Their number is so hight, in fact, that it is one of the main sources of the so called JavaScript fatigue.

But not everybody knows that it is possible to build web sites, single page applications and web interfaces in general also without writing a single line of JavaScript. And I'm not talking about a simple static HTML an CSS web page, but about a rich, interactive application.

There are some alternatives to JS, one of them is the C# based [Blazor](https://dotnet.microsoft.com/en-us/apps/aspnet/web-apps/blazor), by Microsoft.

But the one I will focus on in this post is [Elm](https://elm-lang.org/). Elm is a Domain Specific Language to build web interfaces. It is a purely functional language and its main selling proposition is that it prevents runtime exceptions. It has a lot of nice features and some downsides. Let's take a closer look. 

<!--more-->

## Pros of using the Elm language for the Front End development

### No runtime exceptions

As I said, one of the Elm main benefits is to make it almost impossible to get runtime exceptions in production. This is basically due to its strong and static types system, enforced by the compiler.

Of course, nowadays you can get a static type system also in the JSLand using TypeScript. But with TypeScript there are various escape latches: you can turn off the `strict` compiler option, you can use the `any` wildcard, and even if you are disciplined enough to avoid these shortcuts, errors can sneak in with values coming from the outside, for instance with responses to HTTP calls. To prevent this from happening you need to use one more tool: a data validator such as [Zod](https://zod.dev/). And be even more disciplined to always use it for all the incoming data. 

### Batteries included

So, a second benefit of using Elm is that it replaces a lot of different tools. Not only JavaScript, TypeScript and a validation library, but also:

- A templating language (like [handlebars](https://handlebarsjs.com/))/a view library (like [React](https://react.dev/)). Using plain Elm functions it is possible to write declarative, safe, data driven, HTML
- A client side routing library, like [React Router](https://reactrouter.com/). Elm has it own system to handle client side routing
- A state manager like [Redux](https://redux.js.org/). Elm has its own architecture to handle the global state. It is called [TEA (The Elm Architecture)](https://guide.elm-lang.org/architecture/), and actually Redux was partially based on it
- A way to manage the page title (with React you need an extra library, like [Helmet](https://www.npmjs.com/package/react-helmet) to do that)
- A testing library like [Jest](https://jestjs.io/). [Elm has it own testing library](https://package.elm-lang.org/packages/elm-explorations/test/latest) that is part of the core feature, even if the experimental one. Elm test supports also [fuzzy tests](https://elmprogramming.com/fuzz-testing.html), tests that are automatically repeated dozen of times using randomly generated values, with a preference for corner case values, that are more likely to produce bugs: empty strings, strings with weird symbols, zeroes, ecc

The tool chain is also much simpler than the typical JS based one. The Elm compiler takes care of building, bundling and optimizing the code. So there is no need to deal with the intricacies of the Webpack or Vite configuration.

Then, of course, Elm is a purely functional language, with built in data immutability. So it replaces also:
- a functional library, like [Ramda](https://ramdajs.com/) or [fp-ts](https://gcanti.github.io/fp-ts/)
- an immutability library, like [immutable.js](https://immutable-js.com/)


### Opinionated

The Elm ecosystem is much simpler than the JS one, and for features that are not strictly part of the language core there is generally only one option, or a small set of options:

- There is one formatter, [Elm-format](https://github.com/avh4/elm-format), that cannot be configured, it always formats Elm source code according to a standard set of rules based on the [official Elm Style Guide](https://elm-lang.org/docs/style-guide)
- There is one linter, [Elm-analyse](https://github.com/stil4m/elm-analyse)
- There is one official [VS Code plugin](https://marketplace.visualstudio.com/items?itemName=Elmtooling.elm-ls-vscode)

The Elm compiler also enforces some naming rules:
- File names must be PascalCase and cannot contain dots
- Module names must match their file name, so module Parser.Utils needs to be in file Parser/Utils.elm


### Performance

The compiled Elm code is by default [quite fast](https://elm-lang.org/news/blazing-fast-html-round-two), and [small](https://elm-lang.org/news/small-assets-without-the-headache). 


### Semantic versioning

Thanks to its types system, Elm can enforce a strict semantic versioning for its packages, this prevents all the errors that can happen in JavaScript updating the dependencies.


### Very stable

Elm is a very stable language that evolves very, very, slowly. It is almost frozen, compared to JS and its ecosystem. The last language release (19.1) was back in 2019. So, yes, to use it you must learn something new, but then this knowledge is capitalized.


### Interoperable with JavaScript

Elm is interoperable with JavaScript thanks to a dedicated message system. This allows to use all the JS features that do not have an Elm version: like the local storage or the web sockets.


## Cons of using the Elm language for the Front End development

As always, life is not a bed of roses, and Elm has also some pain points:
- Currently it does not support server side rendering
- It cannot use all the advanced browser APIs, like the indexed DB, the view transition API, and so on. Sure, they can be used via JS, but this adds an extra layer of complexity
- There is not a CSS in Elm solution that uses regular CSS syntax, like [Styled Components](https://styled-components.com/) does. There is [Elm css](https://github.com/rtfeldman/elm-css), but it is a complete rewrite of the CSS with the Elm syntax. Sure it offers all the Elm guaranties, but, hey, I already know CSS, and I don't feel any need to learn a new syntax. Even because CSS is a fault tolerant language that cannot generate blocking runtime errors
- The type system is less powerful and flexible than the TypeScript one (for instance there is no `Partial`, `Pick` or `Omit`)
- The ecosystem is very limited, compared to the JS one
- It is not possible to use the dev tools to inspect and debug the source code

Beside these technical issues, one thing to consider, if you are planning of using Elm at work, is also that in a team it is more difficult to hire people that knows Elm, or that are open to learn it.


## Conclusion

Even with all its limits Elm can be a breath of fresh air, especially if you fall in one or both of these categories: 
- You like functional programming
- You are suffering some form of JavaScript fatigue

Because Elm is quite the opposite of JS. If JS is constantly changing and evolving, Elm is almost frozen. If everything can be done in JS in dozens of different ways, in Elm there is usually only one right or preferred way of doing things. If JS projects require a complex stack of tools and libraries, Elm requires only a limited number of dependencies.




Battery included 
- API calls

Pure functional
- pure functions
- immutability
