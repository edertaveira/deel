# 1. What is the difference between Component and PureComponent? Give an example where it might break my app.

Basically, in component classes, Component don't implements "shouldComponentUpdate" method and PureComponent implements. In PureComponents if haven't changes it blocks re-renders.

# 2. Context + ShouldComponentUpdate might be dangerous. Why is that?

It could be dangerous because "shouldComponentUpdate" is called only when the props or component's state changes. However when a component consume a context, it'll be not updated automatcally when the concept changes.
It might take some unexpected results, when the component is not updated when the context changes even it depends that context to render. it happens because "souldComponentUpdate" is not trigged only when context changes.

# 3. Describe 3 ways to pass information from a component to its PARENT.

- Props using callbacks
- Context API, using context is possible to call a function from the Parent that is providing the Context.
- Custom Events: using `CustomEvent` API the Parent can listen using `addEventListener` to receive the data from child.

# 4. Give 2 ways to prevent components from re-rendering.

- Using React.memo()
- Using useCallback()

# 5. What is a fragment and why do we need it? Give an example where it might break my app.

Fragments are helpful when you need to return multiple elements from a component's render method but don't want to wrap them in a parent element like a `<div>`.
An example that it can block our app is when the jsx is returning multiple elements without a wrapping fragment or element.

# 6. Give 3 examples of the HOC pattern.

```
// with Authentication
import React from 'react';
import { Redirect } from 'react-router-dom';
const withAuthentication = (WrappedComponent) => {
const WithAuthenticationComponent = (props) => {
const isAuthenticated = true // logic to check if user is authenticated
if (!isAuthenticated) {
return <Redirect to="/login" />;
}
return <WrappedComponent {...props} />;
};
return WithAuthenticationComponent;
};
```

```
//with Loading
import React, { useState, useEffect } from 'react';
const withLoading = (WrappedComponent) => {
const WithLoadingComponent = (props) => {
const [loading, setLoading] = useState(true);
useEffect(() => {
//Some async call
setLoading(false);
}, []);

    if (loading) {
      return <div>Loading...</div>;
    }
    return <WrappedComponent {...props} />;

};
return WithLoadingComponent;
};
```

```
//with Logger
import React, { useEffect } from 'react';
const withLogger = (WrappedComponent) => {
const WithLoggerComponent = (props) => {
useEffect(() => {
console.log(`Component ${WrappedComponent.name} mounted`);
return () => {
console.log(`Component ${WrappedComponent.name} unmounted`);
};
}, []);
return <WrappedComponent {...props} />;
};
return WithLoggerComponent;
};
```

# 7. What's the difference in handling exceptions in promises, callbacks and async...await?

- Error Propagation: In promises and async/await, errors propagate down the chain until they are caught by a catch block, whereas in callbacks, error handling is more manual and requires explicit checks.
- Syntax: Async/await provides a more synchronous-like syntax compared to promises and callbacks, making code easier to read and reason about.
- Error Handling: Async/await allows for more structured error handling with try/catch blocks, whereas in promises and callbacks, error handling is handled separately through catch or error arguments in callback functions.

# 8. How many arguments does setState take and why is it async.

Basically two arguments, the first one is the updater and second receive a callback. It's asyncronous to ensure consistency and prevent protencial performance issues.

# 9. List the steps needed to migrate a Class to Function Component.

First you need to replace the `render` function to `return`, basically you are in a function now and it needs to return a JSX. We need replace all methods about stateful logic and lifecicle using hooks like `useState`, `useEffect`, `useContext`.

# 10. List a few ways styles can be used with components.

- CSS Modules
- Inline Styles
- Styled Components
- External CSS Files

# 11. How to render an HTML string coming from the server.

To render an HTML string coming from the server in a React component, you can use the dangerouslySetInnerHTML attribute. However, it's important to use this attribute with caution, as it can expose your application to some attacks if the HTML string contains untrusted content.
