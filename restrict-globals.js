var callWithoutGlobals = function(globalsToRestrict, funcToCall, funcArguments, funcThisArg) {
  if (globalsToRestrict.constructor !== Array) {
    throw "must provide array of globals to restrict";
  }

  if (typeof funcToCall !== 'function') {
    throw "Function to call must be a function";
  }

  if (funcArguments) {
    if(funcArguments.constructor !== Array) {
      throw "Function arguments must be an array";
    }
  } else {
    funcArguments = [];
  }

  var shadowedVariables = [];
  var commaSeparatedParams = '';
  var prefix = '';
  for (var i=0; i<globalsToRestrict.length; i++) {
    var variableToShadow = globalsToRestrict[i];
    if (typeof variableToShadow === 'string') {
      shadowedVariables.push(eval(variableToShadow));
      funcArguments.unshift(undefined);
      eval('var ' + variableToShadow + ' = undefined;');
      commaSeparatedParams += prefix + variableToShadow;
      prefix = ', ';
    }
  }

  if (shadowedVariables.length === 0) {
    return funcToCall.call(funcThisArg, funcArguments);
  }

  var originalAsString = funcToCall.toString();
  var newFuncAsString = 'safeFunction = '
  var indexOfFuncParamsBeginning = originalAsString.indexOf('(') + 1;
  var indexOfFuncParamsEnding = originalAsString.indexOf(')');
  newFuncAsString += originalAsString.substr(0, indexOfFuncParamsBeginning);
  if (indexOfFuncParamsBeginning !== indexOfFuncParamsEnding) {
    var funcParams = originalAsString.substring(indexOfFuncParamsBeginning, indexOfFuncParamsEnding).split(',');
    for (var i=0; i<funcParams.length; i++) {
      var paramValue = funcParams[i].trim();
      if (paramValue.length > 0) {
        commaSeparatedParams += prefix + paramValue;
        prefix = ',';
      }
    }
  }
  newFuncAsString += commaSeparatedParams
  newFuncAsString += originalAsString.substr(indexOfFuncParamsEnding);

  eval(newFuncAsString);

  if (!funcThisArg) {
    funcThisArg = funcToCall;
  }

  return safeFunction.apply(funcThisArg, funcArguments);
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = callWithoutGlobals;
}