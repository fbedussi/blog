---
title: 'Event listeners run only once'
date: 2023-01-05
categories: Tips
layout: post
excerpt_separator: <!--more-->
---

If you want to add an event listener and run it only once, you can use the once option.

```JS
element.addEventListener('click', () => console.log('I run only once'), {
  once: true
});
```
