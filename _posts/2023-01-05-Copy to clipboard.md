---
title: 'Copy to clipboard'
date: 2023-01-05
categories: Tips
layout: post
excerpt_separator: <!--more-->
---

You can use the Clipboard API to create a “Copy to Clipboard” function.

```JS
function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
}
```
