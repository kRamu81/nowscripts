---
title: Java Script Fundamentals
description: Complete guide for Java Script Fundamentals
duration: 45 mins
difficulty: Beginner
category: Development
order: 1
tags:
  - ServiceNow
  - Development
lastUpdated: 2026-06-25
author: NowScripts
---

# Java Script Fundamentals

Welcome to Lesson 1 of the Development course.

## Java Script Introduction

JavaScript on the Now Platform enables you to create more complex logic and user experiences. This series introduces you to the JavaScript language specifically tailored to its use in the Now Platform. Lab exercises cover everything from basic syntax to flow control to complex objects. You'll also learn how to debug and apply common best practices all within the Now Platform.

To run scripts in ServiceNow, navigate to: **System Definition > Scripts - Background**

Your first script:

```javascript
// Anything following '//' is a comment
gs.info('Hello, world!'); // gs.info() = informational output
```

## History of Java Script

JavaScript was created as a lightweight scripting language for web browsers and has evolved into a versatile language used both on the client side (browser) and server side (platforms like ServiceNow's Now Platform). It is a loosely typed language, meaning variables do not require explicit type declarations.

## Client Side Java Script and Server Side Java Script

**Server-side JavaScript** runs on the Now Platform server. Example — querying all active task records and printing each task number:

```javascript
var gr = new GlideRecord('task');
gr.addActiveQuery();
gr.query();
while (gr.next()) {
  gs.info(gr.getValue('number'));
}
```

**Client-side JavaScript** runs in the browser. To create a client script that displays an alert when an incident form loads:

- Navigate to: **System Definition > Client Scripts**
- Click **New**, give it a name (e.g. *Display current state*)
- Assign the **Incident** table, set Type to **onLoad**
- Add the following code:

```javascript
function onLoad() {
  alert('Current state value is: ' + g_form.getValue('state'));
}
```

The alert will display the current state whenever an incident form is loaded via **Incident > All**.

## Java Script Templates

JavaScript on the Now Platform uses script templates that provide a standard starting structure. For example, client scripts are scaffolded with an `onLoad()`, `onChange()`, or `onSubmit()` function depending on the type selected. Server-side scripts (e.g. Script Includes) follow the `Class.create()` / `prototype` pattern:

```javascript
var MyClass = Class.create();
MyClass.prototype = {
  initialize: function() {},
  type: 'MyClass'
};
```

## Use of template.Print

`gs.info()` is the primary output function used in server-side ServiceNow scripts. It logs an informational message to the system log and the Scripts – Background output window.

```javascript
gs.info('Hello, world!');   // informational output
gs.error('Something went wrong: ' + e.message);  // error output
```

Output appears prefixed with `*** Script:` in the results panel.

## Working with Single Line Comment and Multi line Comments

Comments help document your code and can also temporarily disable code during debugging.

```javascript
// This is a single line comment

/* This is another way to comment */

/*
  This is a multi-line comment.
  This code is commented out!
  var name = 'Chuck';
*/
```

**Best practices:**
- Use comments to explain *why* something is done, not just *what* is done.
- Comment out code temporarily when debugging rather than deleting it.

## Types of Variable

JavaScript supports several primitive (scalar) variable types:

```javascript
var name   = 'Chuck';   // String
var i      = 0;         // Integer (Number)
var answer = true;      // Boolean
```

JavaScript is a **loosely typed** language — you do not need to declare the type; it is inferred from the value assigned.

## Working with String and String Concatenation

Strings can use single or double quotes. Use the `+` operator to concatenate strings.

```javascript
var firstName = "Chuck";
var lastName  = 'Tomasi';       // Either quote style is fine
var myCar     = "Chuck's Car";  // Mix them to avoid escaping issues

var name = firstName + ' ' + lastName;
gs.info(name);                          // Output: Chuck Tomasi
gs.info('length of name=' + name.length);
```

**Special characters inside strings:**

| Sequence | Meaning |
|----------|---------|
| `\n` | New line |
| `\t` | Tab |
| `\\` | Backslash |
| `\'` | Single quote |
| `\"` | Double quote |

```javascript
gs.info('Single string\nTwo lines');
gs.info('Chuck\'s simple script');
```

## Working with Arrays

Arrays store a list of values and are addressed as one unit or individually. The first index is always `0`.

```javascript
// Declare and populate
var list = [];
list[0] = 1;
list[1] = 3;
list[2] = 5;

// Shorter declaration
var list = [1, 3, 5];
gs.info('length of list is: ' + list.length); // 3

// Loop through an array
for (var i = 0; i < list.length; i++) {
  gs.info('i=' + i + ' value=' + list[i]);
}
```

**Common array methods:**

```javascript
list.push('Dave');          // Add to end
list.pop();                 // Remove from end
list.shift();               // Remove from front
list.unshift('Jason');      // Add to front
list.splice(2, 0, 'Cary'); // Insert at position 2
list.slice(1, 3);           // Extract positions 1–2 into new array
list.reverse();             // Reverse in place
list.join(', ');            // Convert to string with separator
```

## Java Script Arithmetic Operators

JavaScript supports standard arithmetic operators:

| Operator | Description | Example |
|----------|-------------|---------|
| `+` | Addition | `a + b` |
| `-` | Subtraction | `a - b` |
| `*` | Multiplication | `a * b` |
| `/` | Division | `a / b` |
| `%` | Modulo (remainder) | `a % b` |
| `++` | Increment by 1 | `a++` |
| `--` | Decrement by 1 | `b--` |

```javascript
var a = 12;
var b = 3;
gs.info(a + b);   // 15
gs.info(a * b);   // 36
gs.info(a % b);   // 0
a++;
gs.info(a);       // 13
```

## Java Script Assignment Operators

Assignment operators update a variable's value in place:

| Operator | Equivalent | Description |
|----------|------------|-------------|
| `=`  | —          | Simple assignment |
| `+=` | `b = b + 2` | Add and assign |
| `-=` | `b = b - 2` | Subtract and assign |
| `*=` | `b = b * 2` | Multiply and assign |
| `/=` | `b = b / 2` | Divide and assign |

```javascript
var b = 3;
b += 2;   // b is now 5
b *= 3;   // b is now 15
```

## Variables in Java Script

Variables are declared with the `var` keyword. Follow these naming best practices:

```javascript
// Good — descriptive and includes type hint
var personCount = 0;      // counter/integer
var personList  = [];     // list/array
var personObj   = {};     // object
var personGr    = null;   // GlideRecord

// Bad — avoid these patterns
var c    = "http://www.amazon.com"; // not descriptive
var case = 'CASE0010001';           // reserved word — causes error
var lastEntryInTheListWithRelatedRecords = true; // too long
```

Variable **scope**: variables declared with `var` inside a function are local to that function and not accessible outside it.

```javascript
function toCelsius(fahrenheit) {
  var c = (5 / 9) * (fahrenheit - 32); // local variable
  return c;
}
gs.info(c); // Error: c is undefined (out of scope)
```

## Working with Mathematical Operations

JavaScript's `Math` object provides useful mathematical functions:

```javascript
// Order of operations applies
var c = (5 + 4) * 2;
gs.info(c);  // 18

// Common Math methods
gs.info(Math.round(4.7));   // 5
gs.info(Math.floor(4.9));   // 4
gs.info(Math.ceil(4.1));    // 5
gs.info(Math.abs(-7));      // 7
gs.info(Math.pow(2, 8));    // 256
gs.info(Math.sqrt(64));     // 8
gs.info(Math.random());     // random decimal between 0 and 1
```

To generate a random integer between 0 and N:

```javascript
var rand = Math.floor(Math.random() * N);
```

## Work with Conditions (if, else if and else)

The `if` statement controls the flow of execution based on a Boolean condition.

```javascript
var a = 1; var b = 3; var c = 5;

// Simple if
if (a < b)
  gs.info('a is less than b');

// if / else
if (a < b)
  gs.info('a is less than b');
else
  gs.info('a is greater than or equal to b');

// if / else if / else
if (a < b)
  gs.info('a is less than b');
else if (a > b)
  gs.info('a is greater than b');
else if (a == b)
  gs.info('a equals b');
else
  gs.info('Uh-oh');
```

**Boolean (logical) operators:**

| Operator | Meaning | Example |
|----------|---------|---------|
| `&&` | AND — both must be true | `a < b && b < c` |
| `\|\|` | OR — either must be true | `b > a \|\| b > c` |
| `!` | NOT — reverses the logic | `!valveOpen` |

**Ternary operator** (shorthand if/else):

```javascript
var openStatusString = (valveOpen) ? 'open' : 'closed';
```

## Working with Switch Loop

The `switch` statement is a cleaner alternative to multiple `if/else if` blocks when testing the same variable against many values.

```javascript
var level = 5;
var message = '';

switch (level) {
  case 0:
    message = 'Empty';
    break;
  case 1:
  case 2:
    message = 'Low';
    break;
  case 3:
    message = 'Medium';
    break;
  case 4:
    message = 'High';
    break;
  case 5:
    message = 'Full';
    break;
  default:
    message = 'Uh-oh!';
}
gs.info('Level=' + level + ' status=' + message);
```

- Always include `break` after each case to prevent fall-through.
- The `default` block handles any value not matched by a `case`.
- Multiple cases can share the same block (cases 1 and 2 above both return `'Low'`).

## Working with Functions

Functions let you encapsulate reusable logic, accept inputs (parameters), and return outputs.

```javascript
// Basic function
function sayHello() {
  gs.info('Hello');
}
sayHello();

// Function with a parameter
function toCelsius(fahrenheit) {
  var c = (5 / 9) * (fahrenheit - 32);
  gs.info(c);
}
toCelsius(32);

// Function with a return value
function toCelsius(fahrenheit) {
  return (5 / 9) * (fahrenheit - 32);
}
var c = toCelsius(212);
gs.info(c);
```

**Scope rules:**
- Variables declared inside a function (`var c`) are **local** — not accessible outside.
- Variables declared outside all functions are **global** — accessible everywhere.

**Self-running (immediately invoked) function:**

```javascript
(function() {
  var i = 10;
  gs.info('i=' + i);
}());
```

## Java Script Objects

Objects store related data as key-value pairs (properties) and can also contain methods (functions).

```javascript
// Create an object
var box = {};
box.height   = 20;
box.width    = 10;
box.material = "cardboard";
box.open     = true;

// Bracket notation (useful for dynamic property names)
var vehicle = {};
vehicle['year']  = 2018;
vehicle['make']  = "Toyota";
vehicle['model'] = "Sienna";

// JSON format (preferred shorthand)
var vehicle = {
  "year"  : 2018,
  "make"  : "Toyota",
  "model" : "Sienna"
};

// Check if a property exists
gs.info(vehicle.hasOwnProperty("year"));   // true
gs.info(vehicle.hasOwnProperty("price"));  // false

// Iterate all properties
for (var key in vehicle) {
  gs.info('key=' + key + ' value=' + vehicle[key]);
}
```

**Arrays of objects** combine both concepts:

```javascript
var bookList = [
  { "title": "Moby Dick",            "author": "Herman Melville" },
  { "title": "A Tale of Two Cities", "author": "Charles Dickens" }
];
for (var i = 0; i < bookList.length; i++) {
  gs.info(bookList[i].title + ' by ' + bookList[i].author);
}
```

## Working with Random and Math's

JavaScript's built-in `Math` object provides constants and methods for numeric operations.

```javascript
gs.info(Math.PI);           // 3.141592653589793
gs.info(Math.random());     // Random decimal: 0 (inclusive) to 1 (exclusive)

// Random integer from 0 to 9
var rand = Math.floor(Math.random() * 10);
gs.info(rand);

// Other useful methods
gs.info(Math.max(3, 7, 2));  // 7
gs.info(Math.min(3, 7, 2));  // 2
gs.info(Math.pow(3, 3));     // 27  (3 cubed)
gs.info(Math.sqrt(144));     // 12
```

## Java Script Error Handling

Use `try / catch / finally` to prevent script execution from stopping when an error occurs.

```javascript
// Without try/catch — an error stops all remaining code
for (var i = 0; i < 5; i++) {
  gs.info('i=' + i + ' answer=' + answer); // 'answer' is undefined — throws error
}
gs.info('done'); // never reached

// With try/catch — execution continues after the error is caught
try {
  for (var i = 0; i < 5; i++) {
    gs.info('i=' + i + ' answer=' + answer);
  }
} catch (e) {
  gs.error('Uh-oh ' + e.message); // logs error message
} finally {
  gs.info('done'); // always runs, whether or not an error occurred
}
```

- **`try`** — wraps the code that might throw an error.
- **`catch(e)`** — runs only if an error is thrown; `e.message` contains the error description.
- **`finally`** — always runs regardless of whether an error occurred; ideal for cleanup.

Errors also appear under **System Logs > All** in ServiceNow.
