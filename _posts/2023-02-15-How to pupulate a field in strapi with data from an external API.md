---
title: 'How to populate a field in strapi with data from an external API'
date: 2023-02-15
categories: Recipes
layout: post
excerpt_separator: <!--more-->
---

I'm using (Strapi)[https://strapi.io] for a project in the fashion industry. There are a lot of contents that are related to the "season". I could hardcode in Strapi a list of the past and future season, but it would be better if such a list could be fetched from an external API, so that it would be always up to date.

Thankfully that is not only possible, but even quite easy.

<!--more-->

First of all we need to setup a "season" collection content type in Strapi:
![](/assets/images/strapi-season.png)

Then we need to setup a service that will palace the call and populate the content. We can add it to the `src/api/season/services/season.js` file that Strapi created when we created the content type. The updated file looks like this:

```javascript
'use strict'

/**
 * season service
 */

const { createCoreService } = require('@strapi/strapi').factories

module.exports = createCoreService('api::season.season', ({ strapi }) => ({
  async getSeasons(...args) {
    const { default: fetch } = await import('node-fetch')
    const seasons = await fetch(
      'http://localhost:5001/api/v1/process/seasons',
      {
        method: 'GET',
        headers: {
          authorization:
            'cJMbNXr93DjRQqS56rsh7RnMZABnfrectN0CYkxUefRq6dw3u7qOc51jNxGtPPOsRjeq3aYAU2JaGLQF69iiPPBDymDZLUf31kC7fL6ASePg15YVWJP9Xj7LRnddAIVZ',
        },
        redirect: 'follow',
      },
    ).then((response) => response.json())

    const data = seasons.map((season) => ({ name: season }))

    // Not: The commands below should be change in order to update the contents and to recreate them, otherwise the Ids will keep changing. 
    // Unfortunately this project didn't ship to production, so I never fixed this issue. 
    await strapi.query('api::season.season').deleteMany({})

    await strapi.query('api::season.season').createMany({
      data,
    })
  },
}))
```

I'm using a dynamic import here because apparently `node-fetch` is an ES Module and cannot be imported with `require`.

Apart from that the implementation is quite straightforward. I place the call, format the result, delete all the contents

The last thing we need is a cron job to keep the data updated. This is really easy, since cron jobs are a feature in Strapi. To enable it we need to add these lines to the `config/server.js` configuration file:

````
  cron: {
    enabled: true,
    tasks: cronTasks,
  },
```

so the final file will look something like this:
```jsvascript
const cronTasks = require('./cron-tasks')

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  cron: {
    enabled: true,
    tasks: cronTasks,
  },
})
```

then we need to add the `config/cron-tasks.js` file that will we something like this:
```javascript
module.exports = {
  '* 2 * * *': () => {
    strapi.service('api::season.season').getSeasons()
  },
}
```

Of course the cron expression must be customized to your needs.

That's all.

If you have any suggestion let me know in the comments below.

Bye
````
