console.log('here!')

var UglifyJS = require('uglifyjs');
var fs = require('fs');

var result = UglifyJS.minify('restrict-globals.js', {
  mangle: true,
  compress: {
    sequences: true,
    dead_code: true,
    conditionals: true,
    booleans: true,
    unused: true,
    if_return: true,
    join_vars: true,
    drop_console: true
  },
  wrap: 'callWithoutGlobals'
});

fs.writeFileSync('restrict-globals.min.js', result.code);