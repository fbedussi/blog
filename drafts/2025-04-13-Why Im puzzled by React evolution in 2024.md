---
title: "Why I'm puzzled by React evolution in 2024/25"
date: 2025-04-13
categories: Opinions
layout: post
excerpt_separator: <!--more-->
---

- I've been loving React since 2019
  - tiny abstraction, close to JS
  - components
  - ecosystem

- What is happening: 
  - strongly integrated with Next -> Vercel
  - full stack

- Why this puzzles me:
  - Lock in effect
  - Not fit for every project
    - public/private - high interactivity/low interactivity
  - Monolith


I've been loving React since 2018. At the time my job was building fairly complex e-commerce web sites. Our front end tech stack was based on jQuery and Sass on top of an home made pub/sub framework to allow communication between the different part of a page. The back end was based on .net, and of course all the pages were rendered server side.

This setup served us well, but had some shortcomings: 

- The lack of a global state make it difficult to coordinate the various part of the page. There were the events, but they were ephemeral by nature, and it was very difficult to understand what was the current state in a given moment to be consistent with that
- The global nature of CSS made it almost impossible to understand if a css rule was used and where. Thus refactoring and clean up were very difficult, and the strategy was basically to keep adding overrides on top of other overrides in an evil spiral of increasing specificity.
- More or less the same was true for the JS part. JQuery was a great pice of software, it solved many issues, but it was very difficult to understand what was the scope of a given script. The final result was that there were several scripts that were doing basically the same thing but in different pages, or even on different part of the same page.
- Finally, the imperative nature of jQuery made writing the code tedious and error prone.  

In short, the JS and CSS code had a strong tendency to evolve into the infamous Big Ball of Mud.

Then I met Angular (first version). It was nice, it solved basically all of these issues imposing a clear structure where caos was reigning. But the price was high: you had to replace a good portion of the JavaScript syntax with arbitrary, non standard directives ("ng-whatever"). There was something odd in my opinion. Why I had to use a made up syntax when I was already writing code in a real programming language? 

Then I met React. It had 2 main advantages over Angular: 

- It added a small amount of abstraction on top of JavaScript. It offered a pattern to write declarative, data driven interfaces, something that was not possible with vanilla JS, but if you had to do a cycle or a conditional rendering, you just used the regular JS syntax.
- It was a modular solution, adding different libraries to manage state, routing, styling ect. it was possible to compose a tailored stack without being locked in in a all-in-one framework

On top of that, JSX was a very convenient way of merging JS and HTML without reinventing the wheel.

I loved React so much that I switched company to be able to work full time with it. 

But now I'm puzzled by the evolution React has been taking in the last few years. Maybe It's just me getting older, but I've thought about it, and my opinions are not just gut feeling, on the contrary, they are based to some facts. Let's look at them.

<!--more-->

## How is React evolving?

First of all, what is this "evolution" I'm talking about? It all boils down to 2 points:

- A closer and closer relation between React and Vercel
- An evolution of React to a full stack all in one solution via Next.js

### Why the close relationship between React and Vercel can be problematic

While for FaceBook react was clearly a side project, not related to its business, for Vercel the opposite is true. Its business is selling cloud solutions for the kind of projects that could be written in React. So there is a potential conflict of interests here. Sometimes it's not clear to me if the direction React is taking is due to technical reasons or is driven by the (legit) desire to push the Vercel infrastructure. 

### Why the full stack evolution of React can be problematic

In my opinion we can classify web projects on 2 axis: 

- public/private
- high interactivity/low interactivity

![](/assets/images/web-projects-matrix.png)

Are private all the projects that are protected by an authentication. For these projects the SEO is irrelevant, because the search engine spiders cannot reach the content in any case. If you need to drive traffic from the search engine, you need to use public pages that link to the private application. So the SEO techniques will be applied to the public pages. So client side rendering is a great option for private projects, while server side or static generation are better options for public ones. 

The performance is an issue both for public and private projects, but the metrics are different. For public projects the initial loading and rendering time is critical, because the user is just one click away from the competitors, while for private projects they are not. If the user has gone trough the login process, we already succeeded in getting its attention, now we need to continue earn it by providing a smooth, snappy and seamless experience. So, again, server side, or even better static, generation can help improve the performance metric for public project, while for private ones client side generation can still be a great option. For instance, suppose we are dealing with an application people use to do their job: they will open it as fist thing in the morning, and then they will keep using it for the whole day, or even for many days. So initial loading performance are totally irrelevant.

The highly interactive projects are the one that benefit most from a client side framework like React. If a project has only a small amount of interactivity, like a search box of a newsletter form, we can go away with just a sprinkle of modern JS on top of a static HTML, or even without JavaScript at all. 

So the the situation is like this:

![](/assets/images/different-tecs-for-different-applications.png)

