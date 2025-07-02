---
title: 'What I learned refactoring a medium sized Elm project'
date: 2025-02-01
categories: Opinions
layout: post
excerpt_separator: <!--more-->
---

Recently I've been busy refactoring a medium sized Elm project. The refactor was needed because the code base had grown over the years and had become very contrived and difficult to understand. That is why it was difficult to change and evolve.

During this activity I learned some lessons that I'd like to share. Probably not everyone will agree on every point, but let me know in the comments if you have different opinions.

<!--more-->

## 1. Start a big refactor only if you have a solid functional test suite

I've been able to complete this big refactor only because the project had a quite comprehensive suite of functional tests, written in Cypress, and so totally independent from the implementation.

Unfortunately the compiler alone is not enough. No matter what someone says, "if it compiles, it works" is just not true. To successfully refactor a non trivial code base you need both: a good compiler and a good set of tests that do not depend on the implementation, so they will not break when the implementation changes. In the front end world this means tests that run in the browser against the actual page/app. Cypress, Playwright or another tool, it doesn't matter, as long as they check that the final result is not broken. 

## 2. Proceed in tiny steps

Change one thing at a time, and make sure the code compiles and the tests pass before taking the next step. In this way it is easier to fix any error that should happen. Every time I tried to refactor "also this, since I'm already doing that" I had to roll back, and redo the job one step at a time. 

## 3. Do not persist derived data in the model

This is dangerous because it is basically caching data, and this brings in all the cache related issues: updating and invalidating. As long as there aren't performance issues, derived data should be computed on the fly from a unique source of truth. If and when there are performance issue solve them with the dedicated tools (https://guide.elm-lang.org/optimization/lazy.html).

Just by removing derived data from the model I could delete quite a lot of code and dramatically reduce the complexity of the system.

## 4. Avoid useless code

There is some code that is just useless, like pickers that just pick a field, without any transformation, like this:

```elm
pickText : Article -> String
pickText {text} =
    text
```

For this use case the Elm provides the field accessor function for free (`.text` in this case). True, using `.text` we are coupling the calling code with the exact name of the field, but if everything lives inside the same code base that is not a problem. If we would ever change the field name we can easily do that automatically with every editor/IDE (if the editor you are using doesn't allow code wide rename, change it!). 

Using the build in field accessor not only spares some lines of code, but is even mode secure, because when we write `.text` we are sure that we are actually taking the `text` field, while nothing prevents this to happen:

```elm
pickText : Article -> String
pickText {title} =
    title
```

Pickers can be used if there is some logic in accessing the data: 

```elm
pickPrice : Prices -> Int
pickPrice { currentAmount, baseAmount } =
    if currentAmount > baseAmount then
        currentAmount

    else
        baseAmount
```


Another type of useless code are functions that are basically just wrappers of other functions, like this:

```elm
updatedAgentTools = updateInputAmount agentTools amountAsString

updateInputAmount agentTools amountAsString =
    amountAsString
        |> String.toInt  
        |> Maybe.map (updateAgentToolsInputAmount agentTools)
        |> Maybe.withDefault agentTools

updateAgentToolsInputAmount : AgentTools -> Int -> AgentTools
updateAgentToolsInputAmount agentTools inputAmount =
    { agentTools | inputAmount = inputAmount }
```

This was probably written in case the conversion from `String` to `Int` were needed more than once. But in the end that didn't happen, and there was just a useless middle layer that can be removed:

```elm
updatedAgentTools = amountAsString 
                        |> String.toInt
                        |> Maybe.map (updateAgentToolsInputAmount agentTools)
                        |> Maybe.withDefault agentTools    

updateAgentToolsInputAmount : AgentTools -> Int -> AgentTools
updateAgentToolsInputAmount agentTools inputAmount =
    { agentTools | inputAmount = inputAmount }
```

Useless code is not only useless, but it is actually harmful, because it adds an extra level of indirection, making the code more opaque, and difficult to understand. 

## 5. Avoid module aliases as much as possible

Aliases are nasty because the same module ends up being used with different names in different parts of the code base. This too adds opacity to the system. 

To resist the temptation to use aliases, it is useful to keep the module name short. If you have a module name as `View.RightSidebar.PriceRecap` it is tempting to alias it as `PriceRecap`. The problem is that maybe another dev will alias it as `RightPriceRecap` in another module, and it will be difficult to understand at a first glance if both aliases refer to the same module or not.

If you keep the module in the root its name will be just `PriceRecap`, so no need to alias it and no room for confusion. If you put it in the `RightSidebar` folder its name will be `RightSidebar.PriceRecap`, that is short enough to be used without aliasing. This is one of the reason why in Elm it is better to have a flatter file hierarchy than with other languages. 

## 6. Avoid opaque types 

Speaking about opacity, I see that a lot of devs love using opaque types everywhere. I think this is an anti pattern. Opaque types should be used sparingly because they add, well, opacity. There are definitely some use cases for them, but other than that they should be avoided. 

Opaque types are basically useful in 2 cases. The first one is when we want to avoid consumer code to access the implementation detail behind a type. But this is really useful when we are writing a library that can be used by many external consumers. In that case it makes sense that we declare a clear and rigid interface that hides the internal implementation. Because we don't want to force the consumers to change whenever we change our implementation. But this is not the case if we are just writing a module that is part of a unique code base. In that case it is not a problem to refactor the rest of the code if and when we will change the implementation of the module. It can even be done automatically by the IDE, for instance if we change a name. In this case opaque types do more harm than good, because they force you to write a lot of boilerplate, that can include bugs, and that adds another unnecessary level of indirection to the system making it more difficult to understand. 

The second use case for opaque types is when you want to enforce particular logic in getting/setting the data, but if you don't need to, just go with a regular type that can be used without fuss. 

## 7. Organize code in modules by type, and not by concern

This is the advice of the [official guide](https://guide.elm-lang.org/webapps/modules), but I see that a lot of devs apply patterns from other languages, for example separating the views, the model and the business logic in different files. In Elm this leads to unneeded extra complexity, a symptom of which is the necessity to export/import a lot of things. If you group all the code related to a specific type in the same module you'll end up with a better isolation, that reduces the complexity of the system. 

This is another reason to keep the file hierarchy flatter than with other languages, for example, instead of

```
my-app/
Main.elm
Model/
├─ Article.elm
├─ Comments.elm/
├─ Author.elm
Views/
├─ Page.elm
├─ Subviews/
│  ├─ Article.elm
│  ├─ Comment.elm
│  ├─ Avatar.elm
Helpers/
├─ Article.elm
├─ Comment.elm
├─ Author.elm
```

it is better to have just:

```
my-app/
Main.elm
Author.elm
Article.elm
Comments.elm/
```

It is not a big deal if an Elm file is quite long, 1000 lines is still fine. 

## 8. Avoid too much functional magic

Some functional constructs can be pretty obscure for devs that are new to functional programming, so it is probably better to avoid them, if we want to make our code base more readable, even to newcomers. 

For instance, function composition allows to save some keystrokes, but is it really worth it?

Is this

```elm
isFoo : MyType -> Bool
isFoo =
    .slug >> Slug.equal Slug.foo
```

really better than this:

```elm
isFoo : MyType -> Bool
isFoo myType =
    myType.slug |> Slug.equal Slug.foo
```

or even better:

```elm
isFoo : MyType -> Bool
isFoo myType =
    Slug.equal Slug.foo myType.slug
```

Function composition is often used to avoid writing anonymous functions like in this case:


```elm
List.filter (.place >> .provinceNameShort >> (==) provinceShort) provinces
```

but isn't it better to be a little bit more explicit and write:

```elm
List.filter (\province -> province.place.provinceNameShort == provinceShort) provinces
```

In the snippet above the equality operator is used as a function, this is another pattern that can be quite confusing, especially if the operator is asymmetric. If you write

```elm
applyDiscount : Int -> Bool
applyDiscount price =
    price 
        |> (<) 100
```

it's not clear at a first glance if the intention was to check if price < 100 or the other way around (that is what the code is actually doing). So it's better to stick with the normal form:

```elm
applyDiscount : Int -> Bool
applyDiscount price =
    price > 100
```

To avoid anonymous function sometimes we need to use the `flip` function, that, as the name suggests, inverts the order of the parameters of a function.

What's really happening here?

```elm
joinMessageParticlesContent : List (MessageParticle Msg) -> List (Html Msg)
joinMessageParticlesContent =
    List.concatMap (flip List.append [ Html.br [] [] ] << .content)
```

this:
```elm
joinMessageParticlesContent : List (MessageParticle Msg) -> List (Html Msg)
joinMessageParticlesContent messageParticles =
    messageParticles |> List.concatMap (\messageParticle -> messageParticle.content ++ [ br [] [] ] )
```

It is not a case that the `flip` function has been removed from the language core.  

## 9. Strive for simplicity

If a code base is simple, it is easy for every dev to understand it and to change it. Simple code can remain simple iteration after iteration, because if a dev truly understands the code they can refactor their work with confidence, and to get to a simple solution do you need some cycles of refactoring from the initial implementation. 

If a code base is complex, it can only become more complex as time goes by, because once a poor dev has found a working implementation of the feature they are working on, they will not dare to refactor it to make it better, for the fear of breaking everything.

The biggest enemies of simplicity are premature optimization and premature abstractions. Stick with the easiest solution as long as you don't actually need something more complex. Let's repeat the same code some times before trying to abstract it into a common implementation.

## 10. Don't overcomplicate things just because someone says that "this is the right way"

For instance, you don't need to add a tenth point to a list just because copywriting rules say that a decalogue is a compelling format!
