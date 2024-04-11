# Reactive programming

As Angular is moving toward signals as the new default to handle component state, this will also make it necessary for your code to become more reactive. It is a huge and complex topic with a steep learning curve. I will only scratch the surface, but the following guide will introduce you to some of the concepts and different ways to implement it.

Under resources you'll find links to more information. 

## What is reactive programming
But what is reactive programming, and how do we use it in an Angular context? To introduce you to the concept, I highly encourage you to watch this video by Joshua Morony, which describes how to do reactive/declarative coding in Angular:

[The easier way to code Angular apps](https://www.youtube.com/watch?v=skOTEbGwncE)

 At its core, reactive programming revolves around the concept of reacting to data changes. Instead of managing data updates manually, you set up data streams, and your application reacts automatically when the data changes.

## Imperative vs Reactive
Reactive programming and imperative programming are two distinct programming paradigms, that approach the development of software in different ways. Here are key differences between reactive programming and imperative programming:

### Programming model

#### Imperative
- Focuses on describing step-by-step procedures and instructions for the computer to follow.
- Developers explicitly specify the sequence of operations to achieve a desired outcome.
- The emphasis is on "how" to perform tasks.

#### Reactive
- Focuses on the flow of data and the propagation of changes.
- Programs are structured around reacting to changes in data and events.
- The emphasis is on "what" to achieve, allowing the system to automatically react to changes.

### State handling

#### Imperative
- Involves the manipulation of mutable state.
- Variables are updated over time to reflect changes in the program's state.

#### Reactive
- Emphasizes the use of immutable data and reactive streams.
- Changes in state are propagated through the system using observable streams, allowing for a more declarative approach.

### Control flow

#### Imperative
- Control flow structures such as loops and conditionals are used to dictate the order of execution.
- Execution follows a sequential path of statements.

#### Reactive
- Control flow is implicit and driven by the flow of data and events.
- Reactive systems react to changes automatically, leading to a more event-driven and asynchronous approach.

###  Code readability and maintainability

#### Imperative
- Code can become more complex with increased reliance on mutable state and explicit control flow.
- Debugging and understanding the flow of execution are crucial.

#### Reactive
- Emphasizes a more declarative and concise style of coding.
- Reactive pipelines and transformations make it easier to understand and reason about the flow of data.

### Simple example
To better illustrate the difference between, I have two simple code examples, that shows how to fetch data in an imperative and reactive way. The examples are simplified to better point out differences between two approaches.


#### Imperative

It is worth noticing that the traditional way of subscribing to observables, that we often see in Angular applications is not reactive, but imperative.

```
@Component({
  selector: 'app-my-component',
  templateUrl: './my.component.html',
  styleUrls: ['./my.component.scss']
})
export class MyComponent {
  public userName = '';

  constructor(private dataService: DataService) {
    this.dataService.getUserName().subscribe((userName) => {
      this.userName = userName;
    });  
  }
}
```
You set the userName value imperatively and the template would have to pull the value to display it.

```
<div>
  {{ userName }}
</div>
```

#### Reactive
The reactive approach on the other hand, defines an observable and assigns the data fetching to it, leaving the subscription part to the template.

```
@Component({
  selector: 'app-my-component',
  templateUrl: './my.component.html',
  styleUrls: ['./my.component.scss']
})
export class MyComponent {
  public readonly userName$: Observable<string>;

  constructor(private dataService: DataService) {
    this.userName$ = this.dataService.getUserName();
  }
}
```
Then you would subscribe to the observable via an async pipe in the template, and when the stream changes the value is pushed to the template.:

```
<div>
  {{ userName$ | async }}
</div>
```

### What does reactive programming bring me?

You might think, what does that buy me, that I already have. Let's look at an example where the userName, for some reason, should be displayed in uppercase in another place in the template. How would you go about it in the imperative way?

#### Imperative

```
@Component({
  selector: 'app-my-component',
  templateUrl: './my.component.html',
  styleUrls: ['./my.component.scss']
})
export class MyComponent {
  public userName = '';
  public userNameUpperCase = '';

  constructor(private dataService: DataService) {
    this.dataService.getUserName().subscribe((userName) => {
      this.userName = userName;
      this.userNameUpperCase = userName.toUpperCase();
    });  
  }
}
```
Template

```
<div>
  {{ userName }}
</div>
<div>
  {{ userNameUpperCase }}
</div>
```

Now ask yourself this:  
What happens if you or someone else, changes the userName at another place in the code base?

- You would have to remember to also set the userNameUppcase variable, or you would introduce a bug.

While this may not seem like a big deal in a simple application, then imagine the problems you could have in a large and complex apps with many variables, and lots of places to change them.

#### Reactive

The reactive approach is fundamentally different as direct data access is not allowed and properties are readonly. This ensures immutability, which again ensures predictability and performance. 

```
@Component({
    selector: 'app-my-component',
    templateUrl: './my.component.html',
    styleUrls: ['./my.component.scss']
  })
  export class MyComponent {
    public readonly userName$: Observable<string>;
    public readonly userNameUpperCase$: Observable<string>;
  
    constructor(private dataService: DataService) {
      this.userName$ = this.dataService.getUserName();
      this.userNameUpperCase$ = userName$.pipe(map((userName) => userName))
    }
  }
```
Template 

```
<div>
  {{ userName$ | async }}
</div>
<div>
  {{ userNameUpperCase$ | async }}
</div>
```
Notice, how userNameUpperCase$ is derived from the userName$ observable, so whenever the userName is changed the userNameUpperCase is updated automatically in the template.


## RxJs
Before Signals was introduced, reative programming was usually done with the help of RxJs and the async pipe in them template. RxJs has been part of Angular for a long time, and Observables play a key role when implementing reactive programming. They represent data streams that can emit multiple data values over time.

Interested consumers, can then subscribe to the stream and get notified when the value updates.

Here is a nice introduction to RxJs [RxJs and Observables for Beginners: A Beginner Friendly Introduction](https://blog.angular-university.io/functional-reactive-programming-for-angular-2-developers-rxjs-and-observables/)


## Signals
Signals are a new reactive primitive introduced in Angular 16, which holds a value, but also keeps track of anything that dependens on it and notifies any consumers when the value changes. This allows for more granular updates and wil eventually make zone.js optional.

Here is as nice article explaining Signals: [Angular Signals: Explained with Practical Examples](https://medium.com/@chandrashekharsingh25/angular-signals-explained-with-practical-examples-e45de6d00925)

Please be aware that Signals, while having some similarities with RxJs, are not a replacement for RxJs. They solve different things. Signals are synchronous and RxJs can be both synchronous and asynchronous. So you will not be using signals for http requests.

In short words:
- Signals for state.
- RxJs for events.

To integrate signals and observables, a new package has been created in Angular `@angular/core/rxjs-interop`. It contains way to convert to and from observables.
- toSignal
- toObservable

[RxJs Interorp](https://angular.io/guide/rxjs-interop)

## rxState
rxState is a lightweight state management solution, that will help you maintaining your state in a reactive manner.

I encourage you to look at the [documentation](https://www.rx-angular.io/docs/state). 

Please be aware that currently there are two approaches, described in the documentation, for backwards compatible reasons. A class based(old) and a functional based(new). You should only use the new functional approach as this embraces Signals.

I have created a [Stackblitz](https://stackblitz.com/~/github.com/tobang/reactive-forms-demo), where you will find examples of how reactive state mananagement in rxState can be done.





## Resources
I collected some resources, that explain the concepts in depth.

### General

[Introduction to Reactive Programming](https://dev.to/rajrathod/introduction-to-reactive-programming-3bcf)<br>
[Observables and Observers in RxJS](https://dev.to/rajrathod/observables-and-observers-in-rxjs-1jk5)<br>
[Refactoring Angular Apps To Reactive Architecture](https://christianlydemann.com/refactoring-angular-apps-to-reactive-architecture/)

### Signals

[Exploring Angular Signals](https://medium.com/@eugeniyoz/exploring-angular-signals-8a308fd201f4)<br>
[Signals in Angular – How to Write More Reactive Code](https://www.freecodecamp.org/news/angular-signals/)<br>
[In-depth Angular Signals, mental models for reactive graph, push / pull, laziness and more!](https://www.youtube.com/watch?v=sbIlz-yuxQI)<br>
[Signals: the Do-s and the Don't-s](https://dev.to/this-is-angular/signals-the-do-s-and-the-dont-s-40fk)<br>
[Application State Management with Angular Signals](https://medium.com/@eugeniyoz/application-state-management-with-angular-signals-b9c8b3a3afd7)<br>
[Angular Signals & Observables: Differences](https://medium.com/@eugeniyoz/angular-signals-observables-differences-4a0aa7a13bc)

### RxJs

[RxJS Fundamentals](https://this-is-learning.github.io/rxjs-fundamentals-course/)<br>
[The Most Impactful RxJs Best Practice Of All Time](https://angularexperts.io/blog/the-most-impactful-rx-js-best-practice-of-all-time?ref=dailydev)<br>
