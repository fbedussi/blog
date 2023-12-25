---
title: 'How to build a simple web app with web components'
date: 2023-12-25
categories: Recipes
layout: post
excerpt_separator: <!--more-->
---

Recently I developed a [simple project to test how far is it possible to go in writing a simple web app without any libraries and with the tiniest amount of tooling](https://github.com/fbedussi/key-converter).

Let's clarify one point right at the beginning: when the complexity increases a proper build step and a framework are probably needed. This is just an experiment to understand where this threshold lies.

As a developer, I expect a modern web app to have:

- A modular code base
- Composable components
- Reactivity
- Declarative code style
- Input sanitization
- Scoped style
- A dev server with auto reload and hot reload
- To be testable at all levels (unit, integration, functional, ect.)
- Type checking
- SSR capabilities

<!--more-->

## Results

### Modular code base

This is the easy part, just use ES modules. If needed they can be easily bundled with a production build pipeline. 

### Composable components

Custom element can be used to create composable components.

### Reactivity

Implementing the signal pattern results in a good level of reactivity. A library can be used, but it is possible to use a [basic custom implementation](https://dev.to/ratiu5/implementing-signals-from-scratch-3e4c).

Signals effectively replace: 

- Local state (a signal declared in the component scope and not exported)
- Global state (a signal exported and thus accessible everywhere)
- Effects (an effect is just the subscription to a signal)

### Declarative code style

This is the pain point. I didn't find a way to achieve this without using an external library. I'd like not to take this step because the main objective is to be as close as possible to the web platform standard.

On the other hand, using the imperative code style has the advantage of pairing nice with existing websites, rendered server side.

### Input sanitization

Same as the previous point. **Pay attention not to put user input in the DOM without proper sanitization**. 

A standard [Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API) is being developed, but there is no browser support at the moment. 

Unfortunately, even using only `innerText` to render user input [is not safe enough](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html#usually-safe-methods). 

Due to the sensibility of this topic I'd avoid a custom implementation and go for a library in this case, such as:

- [node-esapi](https://github.com/ESAPI/node-esapi/)
- [DOMPurify](https://github.com/cure53/DOMPurify/)

### Scoped style

It is possible to achieve a basic scoping just by using the custom element name as a namespace. 

I didn't find an easy way to colocate the style with the component. This could eventually be done writing the css in the component file, but that has 2 issues: 

- The style is not applied until the JS has run
- The autocomplete in the editor doesn't work out of the box (but there may be extensions that enable autocompletion in template literals)

An Idea would be to put the style in a CSS file named as the component and add a build step to copy the file content into a global CSS file. 

If you are fine with the limitations of the CSS in JS, though, [you can use the new `@scope` css selector in the custom element markup including it in a `<style>` element](https://developer.chrome.com/docs/css-ui/at-scope#prelude-less_scope).

### A dev server with auto reload and HMR

As a dev server we can use [](https://modern-web.dev/docs/dev-server/overview/), if offers hot reloading out of the box. It offers HHR with [this plugin](https://open-wc.org/docs/development/hot-module-replacement/), but for vanilla components a [change in the code is needed](https://open-wc.org/docs/development/hot-module-replacement/) and I didn't succeeded in implementing it. May be the good ol' webpack is a better choice? 

### To be testable

No big issues here, testing can be done with the usual tools. Just to try something new I played with the [OWC testing package](https://open-wc.org/docs/testing/testing-package/).

### Type checking

VS code can do a basic type check on single files adding the `//@ts-check` comment at the top of the file. To use TypeScript a build step is needed. 

There is a [proposal by Microsoft to bring type annotations to the language](https://github.com/tc39/proposal-type-annotations), but I is still that, a proposal, and in any case I will not offer the same features as TypeScript.

### SSR Capability

If the application is not data driven the so called ["HTML web components"](https://blog.jim-nielsen.com/2023/html-web-components/) can be used. in other words, custom element that wrap regular HTML code. It should be easy to render this kind of HTML server side if needed. 

## Conclusion

It is possible to build a modern web app using only what the web platform offers out of the box. Some compromise on the developer experience (namely, use imperative code style) are balanced by:

- Performance & SEO: the page is basically just ol' regular HTML (but for SEO the internationalization should be done server side)
- A code that will live forever
- No dependencies to maintain
- This approach can be used right now with any existing back end capable of producing HTML, CSS and JavaScript, to add interactivity

## Further improvements

### Development and production build pipeline

A production build step is probably needed to add:

- Bundling
- Minification
- Autoprefixing in CSS (is this really still needed?)
- Polyfills

So, since we are using some tooling anyway, accepting the idea of a more complex setup could unlock some interesting possibilities:

- Hot Module Reloading
- Colocation of CSS and components
- TypeScript

This would satisfy all the initial requirements, except for the declarative code style. But that could be a good trade off to keep thinks simple, future proof and compatible with the existing back ends. 

### Use a templating library

This could satisfy the last requirement, but I have mixes feelings about that. Once you go down this road, why stop and not use a front end framework?

