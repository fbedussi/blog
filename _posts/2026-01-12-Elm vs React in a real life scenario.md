---
title: "Elm vs React in a real life scenario"
date: 2026-01-12
categories: Experiments
layout: post
excerpt_separator: <!--more-->
---

I discovered Elm around 2016, and I immediately fell in love with it. At the time I was working on a fairly complex e-commerce website using jQuery and a custom front-end framework using a pub/sub architecture. Our code was a mess: there was a lot of repetition, bugs seemed to reproduce overnight, and there was always a new one. It was very difficult to orchestrate the different parts of the UI. Given this state of things, Elm was a welcome ray of light. The type system, the compiler, the one-way data flow architecture—they all could have helped solve the pain points we were suffering from. I tried to push for its use in the company, but without success. After a couple of years, I switched companies and tech stacks. Now I was working full-time on React projects. I tried to push Elm even in my new workplace, but the result was the same: nobody was interested. 

Then years passed. I worked more and more on React, and since I couldn't use Elm, I tried to port some of its principles to React: the type system with TypeScript, the one-way data flow with Redux, and the functional paradigm, trying to embrace the functional side of JavaScript.

Fast forward to 2024, I switched companies once more. Now I was working full-time on Elm—hooray! But the thing is that in those 10 years or so, the JS-based ecosystem had evolved a lot, while Elm had not. A lot of the issues we used to have using jQuery to write imperative spaghetti code were solved by the plethora of declarative and reactive front-end frameworks that had emerged. The lack of static types was patched by TypeScript, and, man, TypeScript is not perfect, but its duck typing approach hits a sweet spot between safety and flexibility, and its type system is really powerful. Finally, some nice functional utilities were added to JavaScript, such as `map`, `filter`, and so on. 

On the other hand, Elm continued to suffer from the same pain points: it lacks support for a lot of (and ever-increasing) browser APIs, it doesn't allow interactive debugging (and this really hurts when you have to troubleshoot a weird bug in production), and it has very limited options to handle CSS. It makes it very difficult to do some trivial things, like getting a timestamp or a random number. On top of that, it is very difficult to find people who are proficient in it, or even willing to learn it. Like it or not, it has been rejected by the front-end community.

So in the end, our team decided that it was better to replace Elm with React (+ TypeScript). And we are doing it. One of the things that worried me was the size of the final bundle. Elm is famous for producing small assets, while React is notoriously quite heavy. 

Here are the results of this experiment. 

<!--more-->

# First step: 1:1 porting

To simplify the migration, reduce the risk of bugs, and simplify the alignment of the Elm and React codebases while they are both in use, I opted for a 1:1 port: I converted every Elm file into an equivalent React file, keeping the same architecture using Redux. I used Redux Toolkit to reduce the boilerplate code.  

The result in terms of bundle size for this first version of the port is as follows:

- Elm: 591 KB
- React+Redux Toolkit: 834 KB

So at first glance, the theory that Elm-produced assets are smaller than those produced by React is confirmed (in this case, 41% smaller). But the story doesn't end there. First of all, the difference in gzipped files is drastically reduced:

- Elm: 183 KB
- React+Redux Toolkit: 204 KB

We're talking about 11%, a sign that Elm's output is indeed very optimized, so it compresses less than React's.

Then, being back in JSLand, I finally have access to tools that didn't work with Elm. For example, [Webpack's Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer). Looking inside the bundle, I could see that the libraries have the following sizes:

- React 195 KB
- Redux + React-Redux + Redux Toolkit + Immer + Reselect: 102 KB
- The company Design System 229 KB
- LaunchDarkly SDK (external service to manage feature flags) 38 KB

From this we can deduce that the actual code takes 270 KB, so it doesn't offer much room for optimization.

One of the heaviest parts is, as I feared, React. But, hey, we are in JSLand here, we have options. Plenty of them, actually. So let's try to replace React with Preact. 

# Second step: replace React with Preact

This replacement should be fine in this case, since we are talking about a micro front-end, with no server-side rendering and no use of advanced react-only features. 

The replacement was straightforward, just a couple of lines in the `tsconfig.json` file, and it brought the bundle size down to 661KB, so only 70KB more than Elm, but with the surprise that in the gzipped files the values are reversed:

- Preact 155 KB (gzipped)
- Elm 187 KB (gzipped)

So even at this point I struggle to say that Elm provides a real advantage in terms of bundle size. But we have not finished yet. We can try to replace the entire cumbersome Redux machinery with the leaner Zustand, which should further lower the values.

# Third step: replace Redux Toolkit with Zustand

Zustand can support a pattern very similar to Redux Toolkit, so the replacement took little effort. Unfortunately, in the process I had to add `Dayjs`, a library to handle dates. I tried to do without it, but JavaScript's native `Date` is notoriously flawed and was causing a bug.

So, all considered, the new bundle sizes are:

- 629 KB (vs 590 KB Elm version)
- gZipped: 147 KB (vs 182 KB Elm version)

So it's hard to say which one is the best—I would call it a draw.

# Fourth step: simplify the code

Now I have a last step to take: write the React code in a more idiomatic way. This should remove some layers of indirection and trim some more KBs from the bundle. But I don't expect miracles here, and I won't be able to do that until the rollout of the React version is completed. 

# Conclusions

I think this experiment is interesting because it is about a real-life scenario and application, and it doesn't happen often that you have the chance to write the exact same application in Elm and React and be able to compare the output. 

The results, while confirming that Elm produces really small assets, also indicate that the gap can be practically eliminated, so this should definitely be a point of attention but not a showstopper in the decision process of migrating from Elm to React. 