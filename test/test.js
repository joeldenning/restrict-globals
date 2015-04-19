var expect = require('chai').expect;
var callWithoutGlobals = require('../restrict-globals.js');
global.global1 = {
  restrictedVariable: 'PLEASE DON\'T CHANGE ME'
};

describe('restrict-globals', function() {
  var funcToCall;
  var globalsArray;

  it('protects access to 1 global', function() {
    globalsArray = ['global'];
    funcToCall = function() {
      if (global) {
        throw "I can still access the global scope :(";
      }
      global = 'HAHA I was able to overwrite the protected global';
    };

    callWithoutGlobals(globalsArray, funcToCall);

    expect(global1).to.be.an('object');
    expect(global1.restrictedVariable).to.equal('PLEASE DON\'T CHANGE ME');
  });

  it('protects access to a list of globals', function() {
    globalsArray = ['setTimeout', 'module'];
    funcToCall = function() {
      if (typeof setTimeout === 'function') {
        throw "I can still call setTimeout :(";
      }

      if (typeof module !== 'undefined') {
        throw "I still have access to global variable called module :("
      }

      setTimeout = 'I was able to change a protected variable "setTimeout" :(';
      module = 'I was able to change a protected variable "module" :(';
    }

    callWithoutGlobals(globalsArray, funcToCall);

    expect(setTimeout).to.be.a('function');
    expect(module).to.not.be.a('string');

  });

  it('passes in the funcArguments and allows them to be modified', function() {
    globalsArray = ['setInterval'];
    var parameter1Value = {
      prop1: 'value1'
    };
    funcToCall = function(arg1) {
      if (!arg1 || arg1.prop1 !== 'value1') {
        console.log('arg1 === ');
        console.dir(arg1);
        throw 'My arg1 is no longer being passed in properly :(';
      }

      arg1.prop1 = 'A new value';
    }
    var funcArguments = [parameter1Value];

    callWithoutGlobals(globalsArray, funcToCall, funcArguments);

    expect(parameter1Value.prop1).to.equal('A new value');
  });

  it('allows you to pass in both funcArguments and a thisArg', function() {
    globalsArray = ['global'];
    var parameter1 = ['val1'];
    var funcArguments = [parameter1];
    var thisArg = {
      variableInThisArg: 'the original value for the variableInThisArg'
    };
    funcToCall = function(arg1) {
      if (!this || !this.variableInThisArg) {
        throw "My 'this' context is no longer available :(";
      }
      if (!arg1) {
        throw "My arg1 is no longer available :(";
      }

      arg1.push('a new array element');
      this.variableInThisArg = 'a totally new value!';
    };

    callWithoutGlobals(globalsArray, funcToCall, funcArguments, thisArg);

    expect(parameter1.indexOf('a new array element')).to.be.greaterThan(-1);
    expect(thisArg.variableInThisArg).to.equal('a totally new value!');
  });

  it('allows you to only pass in a thisArg (no funcParameters)', function() {
    globalsArray = ['process'];
    var thisArg = {
      variableInThisArg: 'the original value for the variableInThisArg'
    };
    funcToCall = function(arg1) {
      if (!this || !this.variableInThisArg) {
        throw "My 'this' context is no longer available :(";
      }
      this.variableInThisArg = 'a totally new value!';
    };

    callWithoutGlobals(globalsArray, funcToCall, undefined, thisArg);

    expect(thisArg.variableInThisArg).to.equal('a totally new value!');
  });

  it('allows for an empty array of globals', function() {
    globalsArray = [];
    var aPseudoGlobal = 'original';
    funcToCall = function() {
      aPseudoGlobal = 'new';
    };

    callWithoutGlobals(globalsArray, funcToCall);

    //this verifies that the function is actually being called.
    expect(aPseudoGlobal).to.equal('new');
  });

  it('returns the return value', function() {
    globalsArray = ['console'];
    funcToCall = function() {
      return 'a value';
    };

    expect(callWithoutGlobals(globalsArray, funcToCall)).to.equal('a value');
  });

  it('requires a globals array', function() {
    globalsArray = {}; //this isn't an array, which causes the error
    funcToCall = function() {};

    expect(callWithoutGlobals.bind(callWithoutGlobals, globalsArray, funcToCall)).to.throw();
  });

  it('requires a function to call', function() {
    var globalsArray = ['document'];
    funcToCall = "I'm not a function";

    expect(callWithoutGlobals.bind(callWithoutGlobals, globalsArray, funcToCall)).to.throw();
  });
});