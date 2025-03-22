---
title: 'The joy of classless CSS frameworks'
date: 2025-02-22
categories: Opinions
layout: post
excerpt_separator: <!--more-->
---

Suppose you are building a simple page or application, maybe for internal or personal use. Suppose you don’t need anything fancy—just a good-looking form, some buttons, a headline here, and some text there. Oh, and I almost forgot—a nice modal to give feedback to the user. What will you do? Reach for a fully-fledged CSS framework like Bootstrap? (By the way, is it even used anymore?) Use a complete UI kit like Material UI? Those are clearly overkill. So what’s the alternative? Will you write all the CSS from scratch? That would be tedious.

Luckily, there’s a third way: you can use a mini CSS framework—or even better, a classless one.

<!--more-->

A classless CSS framework is, in essence, just a stylesheet that defines good-looking styles for standard HTML elements. All you have to do is include it in your page and write some semantic HTML—that’s it. No need for a CSS reset, almost no need for custom styling, and no need for a complex framework or component library.

Obviously, this approach doesn’t work for every use case, but if you're working on a simple page or app and don’t have specific design requirements, you should really give it a try.

Recently, I’ve been playing around with Pico CSS. It offers different flavors, including various color schemes. You can download the CSS files or use them via a CDN. It provides a nice set of predefined UI elements and is very easy to extend, thanks to a well-structured set of CSS custom properties for things like colors and spacing.

To achieve a result like this, it took me just a few minutes of tweaking and around 20 lines of custom CSS:

![](https://fbedussi.github.io/blog/assets/images/fake-login.png)

Here’s an extract of the HTML source:

```html
<body>
    <header>
        <hgroup>
            <h1>Conversion Sales Flow Front End</h1>
            <p>Fake Login</p>
        </hgroup>
        <label>
            <input name="use_json" type="checkbox" role="switch" />
            Free payload
        </label>
    </header>

    <dialog>
        <article>
            <header>
                <form method="dialog">
                    <button aria-label="Close" rel="prev"></button>
                </form>
                <p>
                    <strong>Error</strong>
                </p>
            </header>
            <p></p>
        </article>
    </dialog>

    <main>
        <form>
            <fieldset>
                <label>
                    User ID*
                    <input name="user_id" required value="fake-user" />
                </label>

                <fieldset>
                    <label>
                        Resource id*
                        <input name="resource_id" required />
                    </label>

                    <fieldset>
                        <legend>Resource type*</legend>
                        <div>
                            <label>
                                <input type="radio" name="resource_type" value="offer" required checked />
                                Offer
                            </label>
                            <label>
                                <input type="radio" name="resource_type" value="quote" required />
                                Quote
                            </label>
                        </div>
                    </fieldset>
                </fieldset>
```

I really like it—it’s clean and concise (yes, Tailwind, I’m looking at you...). It’s also very easy to modify because you don’t have to worry too much about styling. As long as you're writing sensible HTML, the result will automatically look good and consistent. And as I mentioned, you don’t even need a CSS reset anymore.

So, this is definitely one more tool in my "no-stress front-end" toolbox.

What do you think about classless CSS frameworks? Let me know in the comments!
