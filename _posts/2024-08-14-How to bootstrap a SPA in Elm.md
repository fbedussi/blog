# How to bootstrap a project with Elm

Elm has on official guide that is quite good in explaining the language features and philosophy, but unfortunately lacks a step by step guide to setup a project. It always take me some time to figure out all the necessary steps, so this guide is first of all for my future self, but I hope you can find it helpful too. 

## Setup the editor

If you are not using VS code check the [Elm documentation](https://guide.elm-lang.org/install/editor) to find out how to setup your editor. 

If you are using VS Code just install [this plugin](https://marketplace.visualstudio.com/items?itemName=Elmtooling.elm-ls-vscode).

## Install elm

To install Elm just [download and install the executable for your platform](https://guide.elm-lang.org/install/elm).

## Bootstrap the project

create a folder for your project, e.g.

```
mkdir elm-starter
```

go into that folder, e.g.

```
cd elm-starter
```

If you are using VS code you can run 

```
code .
```

to open the editor, make sure that the elm extension is enabled in this workspace. 

Then run

```
elm init
``` 

To bootstrap the project. Answer "yes" when it asks you to create the elm.json file. 

Create an `index.html` file in the root and a `Main.elm` file in the `src` folder. 

At this point the instructions are a little bit different depending if you are creating a full fledge SPA or if you are mounting the Elm application in an HTML node in the page. In the first case Elm controls all the HTML document and it is the only application running in the page, in the second the Elm application can co-exists with other applications or scripts. 

### Elm Spa

If you want Elm con control all the document you can create an HTML like this:

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="index.js"></script>
</head>

<body>
  <script>const app = Elm.Main.init();</script>
</body>

</html>
```

There are 2 things worth noticing here: 

1. There isn't any root element, like you usually do for React, because the Elm application will mount in the whole page, and not in a specific node. 

2.  The elm application is starter with `Elm.Main.init()`, even in this case we are just starting the application, without giving any mount point. 

Then you can populate the `Main.elm` file with the bare minimum of code to be able to compile: 

```elm
module Main exposing (main)

import Browser exposing (Document)
import Browser.Navigation exposing (Key, load, pushUrl)
import Html exposing (..)
import Html.Attributes exposing (..)
import Url exposing (Url)


-- MODEL

type alias Model =
    { key : Key
    , url : Url.Url
    }

type Msg
    = LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url


-- INIT

init : flags -> Url -> Key -> ( Model, Cmd Msg )
init _ url key =
    ( Model key url, Cmd.none )


-- SUBSCRIPTIONS

subscriptions : model -> Sub msg
subscriptions _ =
    Sub.none


-- MAIN

main : Program () Model Msg
main =
    Browser.application
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        , onUrlChange = UrlChanged
        , onUrlRequest = LinkClicked
        }


-- UPDATE

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        LinkClicked urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    ( model, pushUrl model.key (Url.toString url) )

                Browser.External href ->
                    ( model, load href )

        UrlChanged url ->
            ( { model | url = url }
            , Cmd.none
            )


-- VIEW

view : Model -> Document Msg
view model =
    { title = "My first Elm application"
    , body =
        [ div []
            [ text "it works!" ]
        ]
    }
```

This is a stripped down version of the [demo described in the documentation](https://guide.elm-lang.org/webapps/navigation) where the navigation details are explained clearly.

Since we are using the `Url` module in the code we need to install it with: 

``` 
elm install elm/url
```

If it asks you 

> I found it in your elm.json file, but in the "indirect" dependencies.
> Should I move it into "direct" dependencies for more general use?

Answer yes.

### Elm Element

TODO

## Start the dev server

As a dev server you can use [elm-live](https://www.elm-live.com/), run 

```
npm install -D elm-live
```

To start the dev server you can add an npm script in the `package.json` file:

```json
"start": "./node_modules/.bin/elm-live src/Main.elm --pushstate --hot -- --output=index.js",
```

In this way you can start the project with 

```
npm start
```

In the [elm-live documentation](https://www.elm-live.com/) you can find all the options, we used these one:

- `--pushstate` to handle the client side routing (this is necessary if you are using elm to build a SPA)
- `--hot` and `-- --output=index.js` to enable the hot reloading. As explained in the documentation for `--hot` to work you need to set an explicit `--output` file name.

## Build the project

To build the Elm application in a JavaScript file that you can embed in your HTML you need to run: 

```
elm make src/Main.elm --optimize --output=index.js
```

Instead of remembering the command it is handier to create an npm script in the `package.json` file:

```json
"build": "elm make src/Main.elm --optimize --output=index.js"
```

in this way you can build the project simply running

```
npm run build
```

## Unit testing

To unit test in elm you need 2 things: 

- the [elm-test module](https://package.elm-lang.org/packages/elm-explorations/test/latest), to write tests
- the [node-test-runner CLI](https://www.npmjs.com/package/elm-test) to run the tests

So, install the elm-test module with

```
elm install elm-explorations/test
```

install the test runner with

```
npm install -D elm-test
```

Create your first test file, [the documentation explains where you can locate test files](https://www.npmjs.com/package/elm-test#where-to-put-tests). Personally I prefer to colocate them alongside with the code, so add a `MainTest.elm` file in the `src` folder. Elm enforcers a file name in PascalCase convention, so you cannot use names such as Main.test.elm. The naming convention for file names is to add the "Test" suffix. 

In the file write your first test:

```elm
TODO
```

To run the test you can add an npm script in the `package.json` file: 

```json
"test": "npx elm-test \"src/**/*Test.elm\" --watch",
```

All the [options of the test runner are described in the documentation](https://www.npmjs.com/package/elm-test#command-line-arguments), here we used: 

- `src/**/*Test.elm` because we located the test files in the `src` folder, if you stick with the default location in a separate `test` folder you don't need this option. 
- `--watch` to enable, guess what, the watch mode

## Functional/End to end testing
