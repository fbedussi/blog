---
title: 'The @font-face rule does not work in the shadow DOM'
date: 2025-04-01
categories: TIL
layout: post
excerpt_separator: <!--more-->
---

Yesterday I found out that [the shadow DOM is less isolated than I thought](https://fbedussi.github.io/blog/til/The-style-inside-the-shadow-DOM-is-less-isolated-than-I-thought), but there's another quirk that completely bewildered me: the `@font-face` rule does not work in the shadow DOM. Yes, it's that simple and that frustrating.

<!--more-->

Here's a live demo demonstrating the issue:

<iframe height="300" style="width: 100%;" scrolling="no" title="@font-face does not work in shadow DOM" src="https://codepen.io/fbedussi/embed/WbNYmyR?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/fbedussi/pen/WbNYmyR">
  @font-face does not work in shadow DOM</a> by Francesco Bedussi (<a href="https://codepen.io/fbedussi">@fbedussi</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

This is apparently a [long-standing issue](https://issues.chromium.org/issues/41085401) due to the technical complexities in implementing support for the `@font-face` rule in the shadow tree, even though the [CSS specifications](https://drafts.csswg.org/css-scoping/#shadow-names) define that it should work.

The only workaround is to declare the fonts at the document level, outside of any shadow DOM. This defeats one of the main purposes of using shadow DOM: creating truly encapsulated, self-contained components.

Another nail in the coffin of the shadow DOM, unfortunately. For projects requiring custom fonts in components, this limitation can be a deal-breaker.