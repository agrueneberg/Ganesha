/**
 * @param (data -> []) inputFormat Converts data to an array.
 */
var ganesha = function(job) {
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
    if (job.inputFormat) {
        job.data = job.inputFormat(job.data);
    }
    job.data.forEach(function(element, index) {
        job.map(index, element, mapEmitter);
    });
    if (!job.reduce) {
        return mapOutput;
    } else {
        for (var key in mapOutput) {
            job.reduce(key, mapOutput[key], reduceEmitter);
        };
        return reduceOutput;
    }
};
ganesha.createJob = function(data, map, reduce, inputFormat) {
    return {
        data: data,
        map: map,
        reduce: reduce,
        inputFormat: inputFormat
    };
}
