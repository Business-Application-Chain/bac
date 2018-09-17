var Array = require('node-array');

var a = [ 3, 2, 1, 4, 6 ];

a.forEachAsync(function(element, index, arr) {
    console.log(element);
    console.log('index -> ', index);
    console.log(arr);

    if (element === 3)
        return false;

}, function(err) {
    console.log('complete');
});