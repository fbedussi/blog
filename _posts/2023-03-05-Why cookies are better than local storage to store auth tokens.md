---
title: 'Why cookies are better than local storage to store auth tokens'
date: 2023-03-05
categories: Recipes
layout: post
excerpt_separator: <!--more-->
---

For years I've been keeping my auth and session tokens in the local storage. This strategy has many shortcomings:

1- You need to explicitly manage the writing and reading of the token from the local storage
2- Once you store the token in the local storage, the obvious choice to send it back to the server is inside an auth header, eg: "Authorization: bearer <token>". Unfortunately you can add an header only to HTTP calls made with JavaScript, not calls made by the browser itself to static resource. So, for instance, if you need to protect your images with a token, you cannot just drop an `img` tag in the page with an `src` attribute. The browser would not sent any token. You are forced to use an horrible workaround, like putting the token in the image URL's query string.
3- Local storage can be accessed by JavaScript, that exposes the token to possible [CSRF attacks](https://owasp.org/www-community/attacks/csrf)
4- Local storage does not expires. Either you choose session storage, and the information is wiped out at every session, or choose local storage and the information sits there forever, until is not explicitly removed by the user. Ok, the token duration should be handled by the token emitter, but having more control on token expiration on the cline side is not bad.

All this problems can be, not only solved, but entirely avoided just by keeping the token in a cookie.

<!--more-->

## No need to explicitly manage the token

Once the server puts the token in cookie, a secure and HttpOnly one, e.g. with Express:

```javascript
res.cookie('authToken', authToken, {
  secure: true,
  httpOnly: true,
})
```

The browser will automatically store tke cookie and send it back to every request made to the same domain.

It is important to note here that cookies do not mind about different ports and can ignore subdomains (if the `domain` option is used setting the cookie), so there is no problem for headless application that have the front end and the backend on different subdomains or ports of the same domain.

The token is in the request's cookies field and can be accessed in Express like this:

```javascript
const token = req.cookies.authToken
```

## The token is sent also with request to static resources made by the browser

The token in sent even with requests to images and other static resources made by the browser itself, for instance when rendering an `img` tag with an `src` attribute .

##  An HttpOnly is more secure than the local storage

You the cookie holding the token is set by the server with the HttpOnly flag on, it won't be accessible by JavaScript, so it is immune to [XSS attacks](https://owasp.org/www-community/attacks/xss/).

##  The cookie can have an expiration date

The cookie can be set with an expiration date, this prevents sensitive information to be stored potentially forever in the browser.

Do you think this approach has any drawbacks? If so, let me know in the comments!
