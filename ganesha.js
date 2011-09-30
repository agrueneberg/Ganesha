var mapReduce = function(data, map, reduce) {
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
    data.forEach(function(chunk) {
        map(chunk, mapEmitter);
    });
    for (var key in mapOutput) {
        reduce(key, mapOutput[key], reduceEmitter);
    };
    return reduceOutput;
};
