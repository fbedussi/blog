---
title: 'How to send a SOAP message with PFX certificate authentication in node'
date: 2023-11-01
categories: Recipes
layout: post
excerpt_separator: <!--more-->
---

Recently we had to integrate in a node.js backend an external email service that exposes a SOAP service, protected by a [pfx certificate](https://en.wikipedia.org/wiki/PKCS_12). 

After some trials and errors, it turns out it's quite simple to do it in plain Node.js code, without any external library. 

<!--more-->

```javascript
import fetch from 'node-fetch'
import https from 'https'
import fs from 'fs'

export async function sendSoapMessage() {
	const message = `<?xml version="1.0"?>
    <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope/" soap:encodingStyle="http://www.w3.org/2003/05/soap-encoding">
      <soap:Header>
      ...
      </soap:Header>

      <soap:Body>
      ...
      </soap:Body>
    </soap:Envelope> `

	const pfx = fs.readFileSync('./path/to/certificate.pfx')

	const fetchConfig = {
		method: 'POST',
		headers: { 'Content-Type': 'application/soap+xml;charset=UTF-8' },
		body: message,
		agent: new https.Agent({
			pfx,
			passphrase: 'myPassPhrase',
			maxSockets: 128,
			maxFreeSockets: 128,
			timeout: 60000,
			sessionTimeout: 30000,
		}),
	}

	const result = await fetch('https://soap-service-url.com', fetchConfig)

	if (result.ok === false) {
		const error = await result.text()
		throw new Error(error)
	}

	const xml = await result.text()

	return xml
}
```

Of course in a real application this function would take all the parameters necessary to customize the request. 

The response XML can be parsed with one of the many libraries available on npm, we used [fast-xml-parser](https://www.npmjs.com/package/fast-xml-parser).
