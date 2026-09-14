---
title: "My De-Googling Experiment: Life on CalyxOS"
date: 2026-09-14
categories: Experiments
layout: post
excerpt_separator: <!--more-->
---

Ok, this is not a front-end topic, but I think it may be interesting to share anyway. In the last week, I worked on setting up a de-Googled phone. Is it easy? Is it hard? Do you need to become a kind of digital monk? Let's find out.

<!--more-->

## Why De-Google in the First Place?

You may want to de-Googled for many valid reasons: privacy concerns, technical curiosity, and a basic rule of common sense: **don't put all your eggs in one basket**. Entrusting your entire digital life to a single provider creates a dangerous single point of failure. If your account gets flagged or blocked for any reason, you effectively lose access to your primary device and identity.

## The De-Googling Spectrum: 4 Levels of Detachment

De-Googling is not an all-or-nothing choice. It exists on a continuum:

1. **Level 1 (Easy):** Stop using Google Search. Swapping it for privacy-centric engines (like DuckDuckGo) is trivial; I did it years ago and never missed it.
2. **Level 2 (Moderate):** Replace individual Google apps with alternatives, possibly open source. This is relatively straightforward for most apps. The only one I couldn't replace entirely is Google Maps. There are many navigation apps, but none gives you satellite view, live traffic, public transport info, store hours, reviews, and photos that help you plan your trip.
3. **Level 3 (Advanced):** Remove the system-level Google account from your device. You eliminate deep telemetry while using open-source emulation wrappers to keep crucial everyday apps (banking, messaging, digital IDs) working.
4. **Level 4 (Hardcore):** Completely cut out Google infrastructure, even indirectly. No microG, no Play Services proxies. This significantly alters the modern smartphone experience.

## My Setup: CalyxOS on a Refurbished Pixel 7a

I am currently sitting at **Level 3**. Following a conversation with Gemini, I learned that installing **CalyxOS** on a Google Pixel device was the cleanest route. Paradoxically, Pixel hardware by Google is among the easiest to de-Google because it allows seamless unlocking and re-locking of the bootloader.

I picked up a used Pixel 7a on eBay for €140. The installation process took about an hour directly from the browser and went smoothly overall. Once booted, you get a clean device completely disconnected from Google. Essentially, it is a mini PC that makes calls and browses the web. Unfortunately, the modern mobile experience is not just that.

## The Two Core Challenges of Level 3

To make a de-Googled phone viable as a primary driver, you must solve two major hurdles:

### 1. App Sourcing
F-Droid is fantastic for open-source utilities (like AntennaPod or OpenVPN), but it lacks proprietary essentials like banking apps, WhatsApp, or local car-sharing. To solve this, CalyxOS bundles **Aurora Store**, an open-source client that lets you anonymously download apps directly from the Google Play Store without logging into a Google account. This sounds a little like cheating to me, because, in the end, we are still using a Google service, even if anonymously. Another alternative is to download and install APKs directly, but it is less handy and more risky. This time, I didn't want to overcomplicate things, so I accepted the compromise and used the Aurora Store. Another option is to replace native apps with web apps and PWAs. I did that for many utility apps, and it worked like a charm.

Side technical note: at least on Android, there is very little a native app can do that a PWA cannot do. IMHO, PWAs are technically superior to native apps: they are smaller, safer (because they are sandboxed by the browser), and easier to distribute.

### 2. Google Play Services Emulation
Many critical apps, like banks and digital IDs, rely on low-level Play Services APIs for integrity checks and push notifications. CalyxOS integrates **microG**, an open-source re-implementation of core Play Services. In my testing, microG has handled almost everything flawlessly.

## Real-World Friction Points & Edge Cases

* **WhatsApp:** Transitioning WhatsApp remains a headache. Because chat backups are local, moving them requires careful sequencing. I am currently running WhatsApp in *Companion Mode* because SMS activation failed on the main device (likely due to missing permissions initially, which triggered a rate-limit lock).
* **Contact & Calendar Sync:** Replaced Google Sync with CalDAV/CardDAV hosted on my private server.
* **Cloud Storage & Photos:** Replaced Google Drive and Photos with **pCloud** (a Swiss cloud provider with great cross-platform support) combined with automated backups to my home QNAP NAS over VPN.
* **NFC Payments:** Google Pay does not work without native Play Services. While paying with a physical card isn't a huge drawback, it is one fewer convenience.
* **Android Auto:** Android Auto is heavily tied to Google's proprietary ecosystem. To make it work, I had to install Android Auto, Google Maps, the Google app, and Google Text-to-Speech via Aurora Store. Once launched, alternative turn-by-turn navigation apps like Magic Earth can take over, but Android Auto itself remains tethered to Google binaries.

## Complete Application Compatibility Matrix

| App / Service | Source / Method | Status & Notes |
| :--- | :--- | :--- |
| **Banking (Fineco, WeBank)** | Aurora Store | **Working** — Fully functional via microG |
| **Digital ID (CieID, IO)** | Aurora Store | **Working** — Level 3 NFC card reading works |
| **WhatsApp** | Aurora Store / APK | **Partial** — Running in Companion Mode; primary SMS activation rate-limited |
| **Google Drive / Photos** | Replaced | **Replaced** — Migrated to pCloud & local NAS via VPN |
| **Authentication (Authy)** | F-Droid | **Replaced** — Switched to open-source Ente Auth |
| **Weather App** | F-Droid | **Replaced** — Switched to Breezy Weather |
| **Web Services (IKEA, Gemini, Post)** | Browser | **PWA** — Running smoothly as Progressive Web Apps |
| **Podcasts & Radio** | F-Droid | **Replaced** — AntennaPod & RadioDroid |
| **Google Maps & Camera** | Aurora Store | **Working** — Pixel Camera works great; G-Maps logged in via microG |
| **Misc Utilities** | Aurora / F-Droid | **Working** — Satispay, Telegram, Spotify, KeePass, OpenVPN all work |

## Final Thoughts

Stepping into Level 3 gives you an experience that is almost functionally equivalent to standard Android, with one notable exception: credit/debit card virtualization. It also breaks the direct leash Google holds over your operating system. Going all the way to Level 4 (zero Google dependencies) feels hardcore and would require sacrificing too much modern digital convenience. But who knows, maybe it will be my next step.

However, this experiment highlights how thoroughly wrapped we are in a "digital Matrix". It is so convenient and functional that it is hard to leave. For now, CalyxOS on a Pixel offers a pragmatic middle ground between privacy and isolation.