---
title: 'How to integrate Google Maps into React'
date: 2023-01-18
categories: Recipes
layout: post
excerpt_separator: <!--more-->
---

Sure, you can use an npm package to integrate Google Maps into a React application, but you can easily do it by yourself and avoid a dependency that must be maintained during the project lifetime.

<!--more-->

First of all you need to create a map on the Google Cloud Console and get any API KEY.

Then add the API KEY to your environment variable, e.g.

```
VITE_GOOGLE_MAPS_API_KEY=<YOUR API KEY>
```

Then in the component that should render the map add this `useEffect`:

```typescript
declare global {
  interface Window {
    initMap: () => void
  }
}

useEffect(() => {
  const ID = 'g-map'

  if (!document.getElementById(ID)) {
    window.initMap = () => {
      new google.maps.Map(
        document.getElementById('map') as HTMLElement,
        {
          zoom: 6,  // set your zoom level
          center: { lat: 41.9028, lng: 12.4964 }, // set your center coordinates
          mapId: <YOUR MAP ID>,
        },
      )

    const scriptTag = document.createElement('script')
    scriptTag.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }&callback=initMap&libraries=visualization`
    scriptTag.id = ID
    document.body.appendChild(scriptTag)
  }

  return () => {
    const scriptTag = document.getElementById(ID)
    scriptTag && document.body.removeChild(scriptTag)
  }
}, [])
```

If you need to access the map API you can assign the object returned by the `initMap` function to a ref or a global variable in the js module holding the component.

That's it. Easy Peasy.
