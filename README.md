Restrict globals
================

restrict-globals allows you to prohibit certain functions from accessing specific global variables. The restricted function will not have read nor write access to the variables when it is called. This can be useful for calling functions that you don't want to access the DOM, the JQuery object, the console object, and more.

In the browser
--------------
When restrict-globals.js is put onto the page, it will create a global function called `callWithoutGlobals`, whose usage is described below.

NodeJS
---------
The `restrict-globals` module exports a single function whose usage is described below

Usage
-----
The `callWithoutGlobals` function (or the exported function in NodeJS) allows for four parameters:
* `globalsToRestrict` (required): This is an array of strings, each element being the name of a global variable that you don't want the function to have access to
* `funcToCall` (required): The function to call
* `funcArguments` (optional): An array of arguments to be passed to the function
* `funcThisArg` (optional): The context or thisArg to be passed to the function

Example
-------
See test/test.js for examples on how to use.