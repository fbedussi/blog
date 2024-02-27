---
title: 'How to build a modern SPA client side (almost) frameworkless - Introduction'
date: 2024-02-26
categories: Recipes
layout: post
excerpt_separator: <!--more-->
---

In the [last post](https://fbedussi.github.io/blog/recipes/How-to-build-a-simple-web-app-with-web-components) I explored the so called HTML Web Components. They allow to progressively enhance a site or application where the HTML is static or rendered server side. But what about the classic data drive single page application rendered client side?

Here the HTML must be created on the fly by the client, starting from some data. This is the typical use case for frameworks like React, Angular, Vue, Svelte, Solid and so on. But, can we go frameworkless and use only the web platform?

<!--more-->

Well, actually the answer is... not really. The web platform still lacks 2 key feature to build a client side SPA: 

1. First and foremost there is not a built in sanitization API yet. As we said in the last post, a standard [Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API) is being developed, but there is no browser support at the moment. 
Since the sanitization of user defined content to be rendered in the page is mandatory for the sake of security, we'll need a library to cover this need. 
2. There is not a standard way to declaratively transform data into HTML 

So, unfortunately, we still need some kind of library. We could use 2 different libraries, one for sanitization and one for the declarative templating. For instance, in the past I played with [morphdom](https://github.com/patrick-steele-idem/morphdom) to render and update the DOM. 

But to minimize the number of dependencies and for the sake of simplicity we can find a library that takes care both of the sanitization and the templating. The library should be as small as possible, should be as close as possible to the web platform and should allow to build an application without a build step.

There are some options that satisfy these constraints. One of the best is probably [µhtml (also spelled uhtml)](https://webreflection.github.io/uhtml/).

Just with this single dependency it is possible to develop a fairly complex web app without any build step. Then, if the necessity arises, we can add other dependencies, a build step, TypeScript and all the other usual front end goodness along the way.

In this post series we will see exactly how to do that. We will build a web app to take notes, starting from a very simple and buildless solution and progressively enhancing it.

If that intrigues you, see you in the [next post](http://127.0.0.1:4000/recipes/How-to-build-a-modern-SPA-client-side-almost-frameworkless-Part-1). 
