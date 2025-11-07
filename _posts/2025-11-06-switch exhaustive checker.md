---
title: "Switch cases exhaustive check in TypeScript like Elm does"
date: 2025-11-06
categories: Tips
layout: post
excerpt_separator: <!--more-->
---

One of the strong guarantees Elm offers is the exhaustive check that makes it impossible to forget to handle a possible branch in a `case` statement.

For instance, here:

```elm
type T = A | B

test =
    let
        c : T
        c = A
    in
    case c of
        A ->
            Debug.log "A" ""

        B -> 
            Debug.log "B" ""
 ```

If we don't handle the `B` case the compiler complains:

> This `case` does not have branches for all possibilities.
> Missing possibilities include:
>  B

This is a nice feature, because if later on we add a new variant to the type `T` the compiler will remind us to handle the new branch in the `case` statement. 

It is possible to have something very similar also with TypeScript, both with an [eslint rule](https://typescript-eslint.io/rules/switch-exhaustiveness-check/) and with a clever use of `never`:


```typescript
type T = 'a' | 'b'

const c: T = Math.random() > 0.5 ? 'a' : 'b'

switch (c) {
  case 'a':
    console.log('a')
    break
  case 'b':
    console.log('b')
    break
  default:
    const _exhaustiveCheck: never = c;
} 
```

If you forget one case (e.g. the second one) the compiler will report the error: 

> Type '"b"' is not assignable to type 'never'.

Check it out in this [live example](https://www.typescriptlang.org/play/?#code/C4TwDgpgBAKlC8UDkBDJUA+yBGSBQeAxgPYB2AzsFIQFywJQCyKwAFgHQBOKpAJsQFsAFAEooAPigAGdgFYoAfmRoodJLgLkA7gEtghVlCGExAbzxRqKctFRIaFy9TLliAGwjs3xAOZC7Io6W2JwQKADWjoTWtrgOTs4U7p7efupIgQkhYZGWvBAAZigArm7A8U4kFFQA+hAAHqwllDoAbhAAwqwQhOF0pBDtnAyEANx4AL5QQA).