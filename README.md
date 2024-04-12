# Reactive/Declarative programming

As Angular is moving toward signals as the new default to handle component state, this will also make it necessary for your code to become more reactive. It is a huge and complex topic with a steep learning curve. This guide will only scratch the surface, but it will introduce you to some of the concepts and different ways to implement it.

Under resources you'll find links to more information.

## What is reactive/declarative programming

But what is reactive/declarative programming, and how do we use it in an Angular context? To introduce you to the concept, I highly encourage you to watch this video by Joshua Morony, which describes how to do reactive/declarative coding in Angular:

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

### Code readability and maintainability

#### Imperative

- Code can become more complex with increased reliance on mutable state and explicit control flow.
- Debugging and understanding the flow of execution are crucial.

#### Reactive

- Emphasizes a more declarative and concise style of coding.
- Reactive pipelines and transformations make it easier to understand and reason about the flow of data.

### Simple example

To better illustrate the difference between reactive/declarative and imperative coding styles, I have created as simple example.

#### Imperative

In the imperative way, which is often what you see in traditional Angular applications, you subscribe to the observable and update local variables with the retrieved values. This approach has several flaws.

- Lacks predictablility - You don't know upfront where your variables are updated.
- Performance - No immutability means no OnPush change detection.
- Readability - In large code bases it is not easy to follow the data flow.

```
@Component({
  selector: 'app-my-component',
  templateUrl: './my.component.html',
  styleUrls: ['./my.component.scss']
})
export class MyComponent {
  private dataService = inject(DataService);
  public userName = '';

  constructor() {
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

The reactive approach on the other hand, just defines a local variable called userName$. We assign the observable from the service to the variable to make it available in the component. Note that we are not telling Angular to subscribe or unsubscribe! We are not even seeing an observer! This is where the real declarative style shines.

```
@Component({
  selector: 'app-my-component',
  templateUrl: './my.component.html',
  styleUrls: ['./my.component.scss']
})
export class MyComponent {
  private readonly dataService = inject(DataService);
  public readonly userName$: Observable<string> = this.dataService.getUserName(); 
}
```

It is up to the template and the aync pipe to subscribe and usubscribe to the stream. When the stream changes the value is pushed to the template. In the end we do not care how the subscription is done, as long as the value is displayed:

```
<div>
  {{ userName$ | async }}
</div>
```

### What does reactive/declarative programming bring me? What are the benefits
The trouble with teaching the benefits of reactive and declarative code is that for most people it is not as intuitive as the alternative (imperative code) in the beginning. The benefits of declarative code also only really become apparent when the bigger picture is taken into account and the complexity of the application increases — reactive/declarative code rarely looks beneficial when looking at isolated examples. It is only when you consider the application in a more broad context that the benefits become apparent.

Let's look at a simple example, to illustrate the benefits of reactive/declarative coding. 
The userName, for some reason, should be displayed in uppercase in another place in the template. How would you go about it in the imperative way?

#### Imperative

```
@Component({
  selector: 'app-my-component',
  templateUrl: './my.component.html',
  styleUrls: ['./my.component.scss']
})
export class MyComponent {
  private dataService = inject(DataService);
  public userName = '';
  public userNameUpperCase = '';

  constructor() {
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

- You would have to remember to also set the userNameUppcase variable whenever the userName variable changes, or you would introduce a bug.

While this may not seem like a big deal in a simple application, then imagine the problems you could have in a large and complex apps with many variables, and lots of places to change them. You would have to manually search for each reference of a variable to make sure that any derived values are updated.

#### Reactive

The reactive approach is fundamentally different as direct data access is not allowed and properties are readonly. This ensures immutability and predictability. When looking at the component, you can immediately see what the variables can contain and how they can change over time, without looking at the component context. 
When you look at the userName$ varible, you can see that it contains the value from the dataService and you can tell that it cannot change as it is readonly, so you don't have to look in other places for potential updates to the variable. The declaration contains the full recipe and you don't have to read the rest of the component to understand it.
The same thing applies to the userNameUpperCase$ - which can only change when the userName$ changes as it is derived from userName$

```
@Component({
    selector: 'app-my-component',
    templateUrl: './my.component.html',
    styleUrls: ['./my.component.scss']
  })
  export class MyComponent {
    private readonly dataService = inject(DataService);
    public readonly userName$: Observable<string> = this.dataService.getUserName();
    public readonly userNameUpperCase$: Observable<string> = userName$.pipe(map((userName) => userName.toUpperCase());
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

rxState is a lightweight state management solution, that will help you maintain your state in a reactive manner.

I encourage you to look at the [documentation](https://www.rx-angular.io/docs/state).

Please be aware that there are currently two approaches described in the documentation, for backwards compatible reasons. A class based(old) and a functional based(new). You should only use the new functional approach as this embraces Signals.

I have created a [Stackblitz](https://stackblitz.com/~/github.com/tobang/reactive-forms-demo), where you will find examples of how reactive state mananagement in rxState can be done. The code is heavily commented, so you should be able to easily identify the different parts of the rxState solution.

### Setup your state

The first thing you need to do, is to define the shape of your state by defining a type. This can be done inline, when creating the state:

```
  private readonly state = rxState<{ userName: string }>();
```

or you could also define the shape in a separate type and pass it.

This will create a state object with only one property, userName.

### Getting state
There are three ways to get data from the state:

#### Select
Returns an Observable
```
   this.state.select('userName');   
```
[See API](https://www.rx-angular.io/docs/state/api/rx-state#select)

#### Signal
Returns a Signal
```
   this.state.signal('userName');   
```
#### Get - Imperative
Returns the raw value
```
   this.state.get('userName');   
```
[See API](https://www.rx-angular.io/docs/state/api/rx-state#get)

### Updating state with 'set'

If you want to update data in the state, use can use the set function like this:

```
   this.state.set({ userName: 'Test User' });
```

It can also be used inline when creating the state:

```
  private readonly state = rxState<{ userName: string; }>(
    ({ set }) => {
      // Set initial state
      set({ userName: 'Test User' });
    }
  );
```

[See API](https://www.rx-angular.io/docs/state/api/rx-state#set)

### Updating state with 'connect'

Connects an Observable to the state. Automatically subsribes and unsubcribes.

```
   this.state.connect('userName', this.dataService.getUserName());
```

This will automatically subscribe to the dataService.getUserName() and assign the value to the 'userName' state property. It will automatically unsubscribe.

It can also be done inline on state creation:

```
  private readonly state = rxState<{ userName: string; }>(
    ({ connect }) => {
      // Connect userName
      connect('userName', this.dataService.getUserName())
    }
  );
```
[See API](https://www.rx-angular.io/docs/state/api/rx-state#connect)

### Actions
Actions can be seen as the glue between user based events and your applications state. They should be used in combination with rxEffects or rxState.
```
   public readonly actions = rxActions<{ refresh: void }>();
```
The code above defines a refresh action, which exposes a refresh$ observable and a refresh function.

This refresh action can then be utilized by rxState. Se example below:

```
   private readonly state = rxState<{ userName: string; }>(
    ({ connect }) => {
      // Connect userName
      connect('userName', this.dataService.getUserName()),
      // Connect the refresh action, getUserName, update state with new userName
      connect(this.actions.refresh$, this.dataService.getUserName(), (_, userName) => userName)
    }
  );
```
Now when the user clicks at button in the template
```
   <button (click)="actions.refresh()">Refresh</button>
```
The connect function above ensures that the click is caught and the dataService is called and the state is updated accordingly.

## Stackblitz
As mentioned before, a [Stackblitz](https://stackblitz.com/~/github.com/tobang/reactive-forms-demo) project is available. It is, on purpose, a very simple application to showcase, how to use rxState. Take a look at it and you can fork it, if you would like to play around and save your changes.

Here is a list of features it includes.

- rxState in smart components.
- rxState inline creation.
- rxActions
- rxEffects

For more complex scenarios, where the state is abstracted to an Angular service, please refer to the `app-property_management_mf-angular` repo. Look for files with the `*.adapter.ts` suffix. These are the adapter/facade services.


## Resources

I collected some resources, that explain the concepts in depth.

### General

[Introduction to Reactive Programming](https://dev.to/rajrathod/introduction-to-reactive-programming-3bcf)<br>
[Observables and Observers in RxJS](https://dev.to/rajrathod/observables-and-observers-in-rxjs-1jk5)<br>
[Refactoring Angular Apps To Reactive Architecture](https://christianlydemann.com/refactoring-angular-apps-to-reactive-architecture/)

### Signals

[Modernize State Management in Angular with Signals - Online course](https://egghead.io/courses/modernize-state-management-in-angular-with-signals-6e7ea1c2)<br>
[Exploring Angular Signals](https://medium.com/@eugeniyoz/exploring-angular-signals-8a308fd201f4)<br>
[Signals in Angular – How to Write More Reactive Code](https://www.freecodecamp.org/news/angular-signals/)<br>
[In-depth Angular Signals, mental models for reactive graph, push / pull, laziness and more!](https://www.youtube.com/watch?v=sbIlz-yuxQI)<br>
[Signals: the Do-s and the Don't-s](https://dev.to/this-is-angular/signals-the-do-s-and-the-dont-s-40fk)<br>
[Application State Management with Angular Signals](https://medium.com/@eugeniyoz/application-state-management-with-angular-signals-b9c8b3a3afd7)<br>
[Angular Signals & Observables: Differences](https://medium.com/@eugeniyoz/angular-signals-observables-differences-4a0aa7a13bc)

### RxJs

[RxJS Fundamentals](https://this-is-learning.github.io/rxjs-fundamentals-course/)<br>
[The Most Impactful RxJs Best Practice Of All Time](https://angularexperts.io/blog/the-most-impactful-rx-js-best-practice-of-all-time?ref=dailydev)<br>
