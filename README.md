# parse-loader

This is a class that helps you develop when you need to get results from a Parse backend.

<!-- TOC -->

- [parse-loader](#parse-loader)
  - [Installation](#installation)
  - [API](#api)
    - [Examples](#examples)
      - [Finding elements from a query in a paginated, infinite way](#finding-elements-from-a-query-in-a-paginated-infinite-way)
  - [Bonus](#bonus)
  - [LICENSE](#license)

<!-- /TOC -->

## Installation
```
$> npm i --save parse-loader
```

## API

```js
import ParseLoader from 'parse-loader';

//... let's create a Parse.Query for the example
const q = new Parse.Query('MyClass');

// ParseLoader(query, limit, skip)
const loader = new ParseLoader(q, 10, 0);


// returns the first item on the query, using ES2015 promises
loader.first(); // Promise<Parse.Object>

// returns the first item on the query, using ES2015 promises
loader.find(); // Promise<Parse.Object[]>

// restarts finding at skip 0
loader.restart(); // Promise<Parse.Object[]>

// says if you can load more (only available after first find)
loader.canLoadMore(); // boolean

// loads items infinitely from a Parse Database
loader.findNext(); // Promise<Parse.Object[]>

// loads items infinitely (backwards) from a Parse Database
loader.findPrevious(); // Promise<Parse.Object[]>

// reloads the current search
loader.reload(); // Promise<Parse.Object[]>
```

### Examples

#### Finding elements from a query in a paginated, infinite way
Lets say for the example, that we are in an app where the user 
finds messages sent to them. In this app, when the user scrolls
to the bottom of the page, the list of messages is filled with
more results from the database.

Please note the example does not use any framework in specific.
This works on all of them, so it doesn't matter if you use 
Angular, React, Ember, Aurelia ... (you name it).

```js
import ParseLoader from 'parse-loader';

//... let's create a Parse.Query for the example
const q = new Parse.Query('MyClass');

// create the loader
const loader = new ParseLoader(q, 10, 0);

// function that triggers when the user first enters the page
function onEnter() {
    loader.findNext()
    .then(results => {
    // do something with the results...
    });
}

// when the user reloads the page somehow
function onReload(){
    loader.reload()
    .then(results => {
    // do something with the results...
    });
}

// function that executes when the user reached the bottom of the page
function onUserScrolledToTheBottom() {
    loader.findNext()
    .then(results => {
    // do something with the results...
    });
}

```


## Bonus
* This package has no external dependencies :D
* #findNext takes into account if the search had any errors and repeats the same search

## LICENSE 
MIT  
Developed by Juan Camilo Guarín Peñaranda  
Otherwise SAS, Colombia, 2017  

## Support us on Patreon
[![patreon](./repo/patreon.png)](https://patreon.com/owsas)
