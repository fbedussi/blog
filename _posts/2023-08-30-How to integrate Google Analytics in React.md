---
title: 'How to integrate Google Analytics in React.md'
date: 2023-08-30
categories: Recipes
layout: post
excerpt_separator: <!--more-->
---

More often than not, someone will ask you to integrate Google Analytics into your project, usually that happens just some days before the go live. But don't worry, it's really easy, let's see how.

<!--more-->

As usual there is no need for any third parties library, that will only length your dependencies list, make it harder to maintain. Some lines of code will do the trick.

First of all, if we under the GDPR rule, we need to ask the user the permission, as shown [here](https://fbedussi.github.io/blog/recipes/How-to-implement-a-cookie-banner-in-react), then, when the user accepts, we can call the `startGa` function:


```javascript
const startGa = () => {
    const scriptId = 'gtag'
    const alreadyInit = !!document.head.querySelector(`#${scriptId}`)
    
    // we don't want GA to run on dev envs
    const allowedEnvs = ['production', 'stage']
    
    // grab the env name from the right env variable
    const env = process.env.REACT_APP_ENVIRONMENT_NAME

    if (!alreadyInit && (allowedEnvs.includes(env))) {
      // Insert the GA tracking id
      const TRACKING_ID = 'GA-XXXXXXX'

      // Create the <script> element to load GA
      const gtagScript = document.createElement('script')
      gtagScript.id = scriptId
      gtagScript.async = true
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${TRACKING_ID}`

      // insert it in the <head>
      document.head.firstElementChild
        ? document.head.insertBefore(gtagScript, document.head.firstElementChild)
        : document.head.appendChild(gtagScript)

      // create the script to start GA
      const gtagInitScript = document.createElement('script')
      gtagInitScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', '${TRACKING_ID}');
      `

      // insert it after the previous one
      gtagScript.after(gtagInitScript)
    }
  }
```

Let me know if this works for you. 
