---
title: "I just changed my mind about comments in code"
date: 2025-06-29
categories: Opinions
layout: post
excerpt_separator: <!--more-->
---

As with other things in life, professional growth often follows 3 steps:

- blind acceptance: when you start learning something you treat what is being taught to you as the word of God. That is the way to do things.
- denial: after a while you start to realize that real life scenarios are very different from the ones in textbooks (or in blog posts), so they require something different from the rules you learned.
- compromise: when your expertise increases even more you understand that yes, reality is different from theory, but the theory can still be applied, even if with a grain of salt and not in a mechanical way

I followed this path even about comments in code. 

<!--more-->

When I started learning programming (deh, it was so loooooong ago) every programming book said that comments were good. Comments made the code more readable. So I wrote comments. A lot of comments. 

Then, reading both my code and others' code, I realized that comments made more harm than good. First of all comments were often used to clarify obscure code. But in that case the real solution is to write code that is not obscure in the first place. Write clear code. Write self documented code. Second, when reading a comment there is no way to know if the comment is still relevant or if it is now outdated. Basically you can never trust a comment. There is always the chance that it went out of sync with the code. The code itself is the only source of truth. 

So I made a U turn and started to write no comments at all. I even deleted all the comments every time I was refactoring existing code. Less is more. Let the code speak by itself. 

And I went on with this "no comment policy" for quite a long time. Until recently I read "[A philosophy of Software Design](https://www.goodreads.com/en/book/show/39996759-a-philosophy-of-software-design)". This book made me realize a very simple truth: yes you can (and should) write code in such a way that is very clear **what** it is doing, but sometimes it cannot tell **why** it is doing it. This is where you need comments. So comments should never be a duplication of the code, they should be at an upper level of abstraction.

Let's make an example, this code is probably obscure enough:

```
for (let i=0;i < items.length; i++) {
    for (const property in items[i]) {
        if (items[i][property] === undefined) {
            delete items[i][property]
        }
    }
}
```

that is better to clarify with a comment:
```
// remove undefined fields from items
for (let i=0;i < items.length; i++) {
    for (const property in items[i]) {
        if (items[i][property] === undefined) {
            delete items[i][property]
        }
    }
}
```

but it is even better to rewrite it to be self documenting:
```
function removeUndefinedFields(obj) {
    Object.entries(obj).forEach(([key, value]) => {
        if (value === undefined) {
            delete obj[key]
        }
    })
    return obj
}

const sanitizedItems = items.map(item => removeUndefinedFields(item))
```

It's slightly longer, but it's much easier to understand what is going on. We even have a clue of why we are removing `undefined` fields, we are kind of sanitizing the data. But why exactly do we need this sanitization? If we don't know this crucial piece of information we cannot answer the questions that may arise during a refactoring:
- Do we still need this step? 
- Can we delete it?
- Should we make it more robust stripping also `null` fields?

This is why we need to add this comment:

```
// undefined fields cause errors when saving to Firebase
const sanitizedItems = items.map(item => removeUndefinedFields(item))
```

Ah! Now we have all the answers:
- Do we still need this step? If we are still using Firebase to save data, and if Firebase still doesn't allow `undefined` fields, yes, we need it
- Can we delete it? It depends on the answer to the first question
- Should we make it more robust stripping also `null` fields? No, this is not needed and may cause regressions

So, yes, comments are often abused, like in:

```
// initializing the count variable
const count = 0
```

These comments are useless in the best case scenario, harmful in the worst one. They should be avoided and even deleted if you or someone else already wrote them. But there is definitely a use case for comments every time we need to document why we are doing something, or why we are doing it in a way that may seem odd at first glance. And God knows how often this happens in real life coding. So yes, books were right after all, comments can improve code readability, even in practice.