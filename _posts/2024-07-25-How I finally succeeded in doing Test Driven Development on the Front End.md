---
title: 'How I finally succeeded in doing Test Driven Development on the Front End'
date: 2024-07-25
categories: Recipes
layout: post
excerpt_separator: <!--more-->
---

For years I've been hearing great things on Test Driven Development and on testing in general. But my experience with testing on the Front End has actually been a long history of misery. I've spent a lot of hours in writing tests, only to spent many more of them when a functional change was needed and all the tests had to be rewritten. And all this time was spent with apparently no gain. Only a ridiculous amount of regressions were caught by the tests, around 5 per year, while we were having hundreds of them. There was no relation between the amount of tests written and the amount of bugs in a feature. The most tested features had more or less the same amount of bugs as the untested ones. And finally, tests didn't help at all with refactoring and with code evolution. On the contrary they stood in the way every time the code had to be changed. This is why I was coming to the conclusion that Test Driven Development on the Front End was impossible, and unit testing was doing more harm than good.

But then, on the project I'm working daily, which is big and complex, we are having some big issues, and some of them are clearly caused by a poor testing automation strategy. For instance, when we release on production we are not that confident that everything will work as intended. On the contrary past experience tells us that there will probably be some regressions. This is why at every release on production we must plan at least half a day for manual no regression testing, and some more hours for hotfixing. So, to (hope to) be ready when the business starts its day, he have to start the release process in the middle of the night. And be prepared for a lot of stressful hours of emergency work. How better would it be if at least part of this testing could be automated!

So, my feelings were split. On one hand I was hating automated tests. On the other one I was wanting more of them.

But, then, finally, I saw the light too!

![](https://viralviralvideos.com/wp-content/uploads/GIF/2014/10/Blues-Brothers-Clarity-Seen-the-light-Sudden-clarity-I-have-seen-the-light-The-Light-GIF.gif)

<!--more-->

Some weeks ago I was speaking with a friend, telling him my frustration on this subject. He suggested me the [Outside In React Development book](https://outsidein.dev/book/). I read it, and it literally changed my approach to testing. 

## The road to the Test Driven Development

This is the chain of thoughts that in the end led me to the necessity of Test Driven Development, and specifically to the Outside In variant: 

1. Automated tests are needed. As I said before, when the project grows, if you don't have a solid test automation strategy you will get into serious troubles. 

2. I'm saying "test automation strategy", because it's not only unit testing, but also stress/load testing and functional/integration/end-to-end testing. Every category of tests serves different needs. Unit tests are great to test algorithms and pure functions, functional/integration/end-to-end tests are great to test complex behaviors. Stress/load tests check that what works in test environments with few data and few users will also work in production with a lot more data and users. 

3. So, if your problem is that your automated tests are not catching enough regressions, probably you need more functional/integration tests, because these are the ones that check that if you change the point A, this will not break the point B. Unit tests cannot do that, because point A is tested separately from point B. But unit tests, if they don't rely on the internal implementation, can help in refactoring a unit without changing the behavior. So, since my problems were exactly that: 
  a. My unit tests were not catching regressions
  b. My unit tests were getting in the way when I implemented functional changes
this means that I needed more high level functional tests, and less low level unit tests, and those tests should be decoupled from the implementation as much as possible.

4. Writing tests can be hard, and it is harder if the code was not written to be tested in the first place. You may have function/methods that take too many arguments, do too many things, have side effects difficult to test, rely on external dependencies that are hard to mock. So, if you need to write tests (and on point 1 we assume we really need to), it is better to write the tests before the code, which is basically the Test Driven Development. 

5. Change the way the code is written, to make it more testable, is not a shame. On the contrary, it is a best practice. One of the aims when coding is code reuse, in other words, our code should be written in such a way that it could be used by more than one consumer. Tests are just another consumer of our code, beside the application we are developing.

## Why I failed to do Test Driven Development on the Front End

Given this considerations, I can probably understand why I failed so many times to apply TDD to the Front End:

- First of all, the Front End code lives in the browser, so it should be tested mainly in this environment. This means more functional tests, and maybe less so called unit test (that some times are not so unitary...). Functional tests have a lot of advantages: 
  - they cover the actual behavior the user expects
  - there are less things to mock (no need to mock all the browser related stuff, no need to mock all the dependencies of a single unit)
  - they are easier to debug using the browser dev tools
nowadays we have some very powerful tools to test in the browser, like [Cypress](https://www.cypress.io/) and [Playwright](https://playwright.dev/), so this has become a lot easier to do than, say, ten years ago. 

- Second, I was afraid to change the way I wrote the code to make it more testable. This is wrong. Instead, it is good to change the way you code to make tests easier to write. This can mean many things: 
 - Write smaller and more focused functions/methods (single purpose principle)
 - Make dependencies explicit (dependency injection)
 - Avoid side effects, prefer pure functions
Speaking about a React application, this means: 
  - Extract all the logic to pure helper functions, that are very easy to test, put all this helpers in a dedicated file, in order to leave the view as clean as possible
  - The components that are unit tested should be pure functions, all the side effects, such as data loading, data writing, dispatch of actions, ecc. should be done outside the components and triggered by callbacks passed as props. This makes the component very easy to unit test, and even to render in tools as Storybook.

- Third, tests should be decoupled from the implementation as much as possible. The React Testing Library did a great job in allowing that, but there are still some details to watch out for. For instance, the React Testing Library documentation suggests that tests should mimic the real user behavior and expectations as much as possible. This is good, but can be tricky. For instance, since the user will click on button with the label "save", we can conclude that in our test we should click on `<button>save</button>` element. But this can be a form of coupling with the implementation. It depends if we consider that the element the user clicks is a `<button>save</button>` is a user facing feature or an implementation details. It is probably both. But to make tests more resilient I think it is better to consider them as an implementation detail. For instance, if we replace the "save" label with an icon, should the tests break? Yes and no. If we are testing the accessibility, probably yes, but maybe we are working on a project where accessibility is not a requirement. And if we change the label to "ok"? Should the tests break? Probably not. At least not all the tests that interacts with that element. This is why I've come to conclude that the default way to get an element is by a test-id. The test-id is dedicated to tests and is more stable than other identifiers (classes, labels and aria-roles).


## What is the Outside In Development 

The Outside In development is a form o Test Driven Development that starts writing tests from the outside, that means write high level functional tests first. Then once we have the functional test failing, we start to think on how to implement the feature. Once we have a plan on how to develop the feature we start to write the first unit test that covers the first bit of the implementation. Once we have the first unit test failing we start to write the code that makes the unit test green. At this point we can refactor the code if needed, paying attention that the test is still green. Then we go on writing more unit tests and more code until we pass the functional test.

So, basically, we have 3 nested cycles: 

```
while (there_are_functionalities_to_implement) {
  write_a_functional_test()
  while (the_functional_test_is_red) {
    write_a_unit_test()
    while (the_unit_test_is_red) {
      write_the_code_to_make_the_unit_test_green()
    }
  }
}
```

## The advantages of Outside In Development compared to traditional Test Drive Development

The main advantage of the Outside In Development is that you start writing functional tests from the beginning and you don't rely only on unit tests. In this way you have a strong multi level testing strategy, where each level addresses specific issues:
- With functional tests you cover: 
  - the high level behavior
  - the integration between the different components and application levels
  - all the browser related stuff
- With unit tests you cover: 
  - the single pieces of logic (e.g. algorithm, criteria for conditional rendering, data transformations and so on)
  - all the corner cases and small details that can be too expensive to test at a functional level
- With TypeScript you cover:
  - interface compliance
  - general type safety

Working in this way is a little bit slower then developing without testing, bug faster then writing tests after the code, because the tests you write help you in writing the code, and the tests make much more sense, because they are not an afterthought.

The final result is:
- A coverage that naturally tends to 100%, and for sure covers all the main flows
- Less time spent, compared to writing the tests after the code
- Tests that are a lot more fun to write because:
  - You don't have to mock the entire jungle every time you are eating a banana, you can write a test as simple as you like, then write the code that makes that test green
  - Unit tests cover almost only pure functions, so writing them is a breeze, while complex integration issues are tested at a functional level, where they are easier to handle
- Tests are easier to maintain because they are more focused and clear, so it is easy to understand how you need to change the test if you want to change the behavior. Actually, when you will need to change the behavior you will change the tests first

## En example of how to practice Test Driven Development on the Front End with the Outside In methodology

From a practical point of view, in a React Front End project, how can we implement the Outside In methodology?

Let's make an example. Suppose we need to implement a simple login form. 

The requirement in the user story is:

> The user can log in to the application providing their email and password, and clicking on a login button. 

From this requirement we can derive this high level technical analysis: 

> There will be a view, containing a form with an email text field, a password field and a submit button. When the user clicks the submit button (or press enter), the system checks that both the fields are filled in with valid values and then do a POST call, sending the values to the backend. If the call succeeds the user is taken to the home page. If not, an error message is shown. 

After the high level technical analysis we realize that there are still a couple of open points: what are the "valid values"? What are the errors we need to handle?

We put our mind to it, maybe we talk with the Business Analyst, and in the end we come up with this answers: 
- The first filed is valid when it contains a syntactically valid email
- The second field is valid when it contains a string longer than 8 that contains uppercase and lowercase letters and numbers (I'm not suggesting that this is the right password rules... it's just an example...)
- On submit we need to handle these errors: 
  - Username/password not valid, in this case we need to tell the user there is a problem with the data they provided
  - Any other error that could happen in a REST call: 500, 503, ecc. In this case we can tell the user that there has been an unexpected error, and they should retry later

Ok, now we can start coding. First of all we need a functional test that checks that: 
  - When the application is open there are: a text field labelled "email", a password field labelled "password", a button labelled "login"
  
To make this test pass we can write a dumb functional components that only renders these fields. We could also write a unit test for that component that checks the view output is correct, but in this case it will be a duplicate of the functional test, so we can skip it. Or maybe we can use a snapshot test, since it is so quick to write (but also so easy to ignore when it will fail...).

When we have the first functional test green is time for the second one:
  - On submit, if a user did not populate the field correctly, an error message is shown. 

Now, there are many ways in which the user can populate the fields with wrong values, including not populating them at all. Since unit tests run faster than functional one, in case like this we can write a functional test that checks one major case, and leave all the others, including corner cases, to unit tests. 

So, for instance, we can write a functional test that checks that an error is shown if the email address does not have a @ char in it. Then we start writing unit tests. Since at this level we want to test all the possible corner cases we want a code where we can easily mock all the possible alternatives. What we can do is to design the view as a pure function that takes a validation function as a prop, calls it when the form is submitted, and, if it returns an error, shows that error, without calling the submit handler. In this way we will have only one test that checks only one behavior: if there is a validation error, show it and halt. As explained before, to decuple the unit tests from the implementation, the default way to select elements in the view should be by a test id. Notice that while we are still writing the tests we need to define how the validation function will report the errors, will they be Error objects? Will they be strings? If they will be instances of the Error object, will they be thrown or just returned? This is one of the ways in which writing tests help us in writing the code. 
  
Now that we have a working view we can write the validation function. This will be a pure function by its nature: it takes 2 (maybe empty) strings and returns an error. So we can easily write as many unit tests as we want to cover all the possible cases: the fields are empty, the password il less than 8 char long, it does not contain a mix of uppercase and lowercase chars and numbers, it contains forbidden symbols, the email does not have a top level domain and so no, so forth. This is another case in which the tests are helping us in writing the code. Suppose we are validating using regular expressions. They are notoriously error prone, and it helps having a test that checks that the reg exp is actually doing what we intended.

Next we pass to the submit behavior. As usual we start with a functional test. This test should check that once the fields are populated correctly, if we submit the form, the right route will be called on the back end. If the route response is OK we land on the home page, if not, an error message is shown. We can split this check in 2 tests: one for the OK behavior and one for the KO. Here we have the first thing to mock so far: the submit route. But, please, notice how far we came without mocking anything. If we are doing a proper end to end test, and so the Front End is connected to a real Back End we could skip also this mock, but we need to understand if and how we can test both the OK and KO scenario.

Once we have the failing functional test we go down a level and start writing unit tests. Even in this case the view is much easier to test if it is a pure function, so it will take the submit handler as a prop, and even the navigation to the home page will be a callback passed as a prop. The unit test of the view will test only that these callbacks are called. Their implementation will be in a wrapper component, but we don't need to unit test it, since it will be tested at the functional level. What we need to test is that, if the submit callback returns ok, then the navigation handler is called. 

Once we have the implementation for the OK scenario, we can start with the tests for the KO scenario. In this case we need to check that if the submit callback returns an error, a message is shown and the navigation handler is not called. If we are using a library to manage the HTTP calls that handle errors we are probably done, otherwise, if we are working directly with the fetch API we need to write a helper that handle all the possible failures of the http call (404, 401, 403, 500, timeout, ecc.)

## Conclusions

With some architectural tweaks (views as pure functions and test ids on the elements), and with the Outside In methodology, it is possible to effectively practice the Test Driven Development on the Front End. While writing the code we have:
- Tests that are easier to write, compared to writing them after the code
- Tests that help us writing he code
- Tests that help us refactoring the code
- Code units that are smaller and more focused

What we end up with is: 
- A working application
- A comprehensive set of automated tests, both functional a unitarian. They will give us a good level of confidence that the application is working as intended in a given moment, both before and after a deploy

When we will change the code:
- The functional tests will help in catching regressions
- The unit tests will help in refactoring the code
- The tests will be small, focused, with few mocks, so they will be easy to change

These are exactly the benefits promised by the TDD theory. Now, for the first time, I can confirm they are true! 

You can check out [the project where I tested this methodology on GitHub](https://github.com/fbedussi/ganpro). Let me know your opinions in the comment, thanks for reading!
