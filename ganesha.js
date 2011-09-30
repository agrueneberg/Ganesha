/**
 * @param (data -> []) inputFormat Converts data to an array.
 */
var mapReduce = function(data, map, reduce, inputFormat) {
    var mapOutput = {};
    var reduceOutput = {};
    var mapEmitter = function(key, value) {
        if (!mapOutput[key]) {
            mapOutput[key] = [];
        }
        mapOutput[key].push(value);
    };
    var reduceEmitter = function(key, value) {
        if (reduceOutput[key] === undefined) {
            reduceOutput[key] = [];
        }
        reduceOutput[key].push(value);
    };
    if (inputFormat) {
        data = inputFormat(data);
    }
    data.forEach(function(element, index) {
        map(index, element, mapEmitter);
    });
    for (var key in mapOutput) {
        reduce(key, mapOutput[key], reduceEmitter);
    };
    return reduceOutput;
};
