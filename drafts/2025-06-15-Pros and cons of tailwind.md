---
title: "Pros and cons of Tailwind"
date: 2025-06-15
categories: Opinions
layout: post
excerpt_separator: <!--more-->
---

Ci provo, iniziamo dagli ovvi contro:
- reinventa la ruota: non fa nulla che non si possa già fare in altro modo
- è un DSL, quindi, in quanto tale:
    - arbitrario
    - aggiunge un layer di indirezione
    - aggiunge carico cognitivo
- non è standard, pertanto ad alto rischio di obsolescenza
- può essere molto ripetitivo, ma in uno scenario di sviluppo moderno, dove si lavora per componenti, questo non dovrebbe essere un problema, perché non è che ripeti la sfilza di utility class per ogni bottone, la astrai in un componente bottone

Questi sono i motivi per cui me ne sono sempre tenuto lontano e sono stato ad aspettare di veder passare il cadavere. Ma ormai è entrato nell'uso così tanto che volente o nolente non posso permettermi di ignorarlo, per cui mi sono rimesso a studiarlo, e ho capito che in effetti ha anche qualche vantaggio. 

Cominciamo con quello che mi interessa di più al momento: è una soluzione molto indipendente dal resto della toolchain, in particolare è l'unica, tra le soluzioni mainstream, a poter funzionare con Elm. Mi sarebbero bastati i CSS modules, ma non c'è modo di farli funzionare con Elm. 

Inoltre:
- risolve l'unico vero problema del CSS, che è lo scope globale e quindi la difficoltà di capire dove agisce una data regola
- è un sistema, che include un reset e un tema, quindi è una risposta unica e coerente alla gestione dello stile. Come già detto si può fare tutto anche senza, ma è comodo avere una base già pronta e una logica unica (palette colori, gestione breakpoint, spacing, ecc.). Fare tutto in CSS nativo è possibile, ma verboso (text-gary-50 vs color: var(--color-grey-50)), richiede disciplina e può facilmente sfuggire di mano nel lungo periodo, specialmente quando ci si lavora in più persone. Es. la gestione delle media query in CSS nativa non è banale, perché i breakpoint non possono usare variabili css. 
- lo stile è quasi sempre colocato con il markup, una cosa che ho apprezzato tantissimo degli Styled Components, e che non hai con altre soluzioni come CSS Modules.
- risolve alla radice il problema del CSS morto, che è molto difficile da affrontare con altre metodologie (es. CSS Modules, non è immediato capire se una classe è usata o no)
- produce un unico file CSS statico con le sole regole utilizzate, quindi dovrebbe essere il massimo della performance (al contrario delle varie soluzioni CSS in JS, e al contrario di vecchi approcci alle utility class come Bootstrap)
- rispetto ad altri scenari, es. SCSS + poscsss, può semplificare il tooling
- evita il tedio di doversi inventare nomi di classe/componenti
- non ti impedisce di scrivere del CSS standard se e quando lo vuoi

Quindi, per rispondere alle domande di Max: io probabilmente non voglio, ma 
a. su alcuni progetti potrebbe essere la sola strada percorribile (es. Elm)
b. su altri potrebbe essere un buon trade off, la decisione finale va lasciata al team, dipende molto anche da quanto è skillato nel CSS, vedo che per tanti è un problema. 