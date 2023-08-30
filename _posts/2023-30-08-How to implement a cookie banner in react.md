---
title: 'How to implement a cookie banner in react'
date: 2023-30-08
categories: Recipes
layout: post
excerpt_separator: <!--more-->
---

The EU GDPR gives the EU citizens some nice rights on their data. Unfortunately, as a side effect, almost every sites needs the infamous "cookie banner". 

The good news is that we don't need a library to implement it in React, it takes just some lines of code.

<!--more-->

First of all, let's setup a way to persist the information when the user accepts the cookie policy:

```javascript
const COOKIE_POLICY = 'ben-cookie-policy'
const persistCookiePolicy = () => {
  window.sessionStorage.setItem(COOKIE_POLICY, 'accepted')
}
const getPersistedCookiePolicy = () => {
  return window.sessionStorage.getItem(COOKIE_POLICY)
}
```

The at the top of the component tree, let's say in the `App` component, we render the cookie banner if the user hasn't accepted the cookie policy  yet. 

When the user accepts the cookie policy, we save that information, hide the banner and start the tracing. 

```javascript
function App() {
  const cookiePolicyAccepted = getPersistedCookiePolicy()
  const [showCookieBanner, setShowCookieBanner] = useState(!cookiePolicyAccepted)
  
  const hideCookieBanner = () => {
    persistCookiePolicy()
    setShowCookieBanner(false)
  }

  const startTracing = () => {
    // Start collecting user info
  }
  
  useEffect(() => {
    if (cookiePolicyAccepted) {
      startTracing()
    }
  }, [cookiePolicyAccepted])
  
  return (
    <>
      <Routes />
      {showCookieBanner && <CookieBanner closeBanner={hideCookieBanner} />}
    </>
  )
}
```

The cookie banner itself is quite dull:

```javascript
const CookieBanner: React.FC<Props> = ({ closeBanner }) => {
  return (
    <Wrapper>
      <MainTitle>Title</MainTitle>
      <Text>
        Cookie banner text
      </Text>

      <ButtonWrapper>
        <Button onClick={closeBanner}>OK</Button>
      </ButtonWrapper>
    </Wrapper>
  )
}
```

And that's all, just remember to check all banner copy with your legal department :-)
