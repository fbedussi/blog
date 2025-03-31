---
title: 'The style inside the shadow DOM is less isolated than I thought'
date: 2025-03-23
categories: TIL
layout: post
excerpt_separator: <!--more-->
---

Over the years, I've experimented with the shadow DOM several times but never had the chance to use it in a real project. One of the main limitations that held me back was my understanding that styles inside the shadow DOM are completely isolated from outside styles. This would make it difficult to build components as part of the same application, where you typically want components to share at least some common styling. So I made a mental note to use shadow DOM only when I needed 100% style isolation.

Today that day finally came! I had a perfect use case requiring complete isolation! I eagerly pulled the shadow DOM from my toolbox where it had been waiting for so long. But wait—what's happening? Why is the text inside my shadow DOM adopting styles from outside?

<!--more-->

It turns out my mental model of how shadow DOM works was flawed. The style encapsulation is strong but not absolute. I already knew that custom properties (CSS variables) can pierce the shadow boundary, but I discovered that inheritable properties also flow through. There are many [inheritable properties](https://gist.github.com/dcneiner/1137601), with the most commonly used being those related to typography:

- color
- font-family
- font-size
- font-style
- font-variant
- font-weight
- font
- letter-spacing
- line-height
- text-align
- text-transform
- white-space
- word-spacing

This explains why text within my shadow DOM was picking up global styles. Unfortunately, this discovery—combined with the fact that `@font-face` rules don't work inside shadow DOM (which I'll cover in a future post)—triggered a redesign of my approach. I ultimately had to abandon shadow DOM for this project and return it to my toolbox once again. One damned shadow DOM! One day you'll be mine!