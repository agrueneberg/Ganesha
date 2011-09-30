var ganesha = function() {
    var _submitJob = function(job) {
        if (!job) {
            throw 'Please provide a job description.';
        }
        if (!job['data']) {
            throw 'Please provide input data.';
        }
        if (!job['map']) {
            throw 'Please provide a map function.';
        }
        if (!job['callback']) {
            throw 'Please provide a callback function.';
        }
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
        if (job['inputFormat']) {
            job['data'] = job['inputFormat'](job['data']);
        }
        if (!Array.isArray(job['data'])) {
            throw 'Please provide the input data as an array.';
        }
        job['data'].forEach(function(element, index) {
            job['map'](index, element, mapEmitter);
        });
        if (!job['reduce']) {
            job['callback'](mapOutput);
        } else {
            for (var key in mapOutput) {
                job['reduce'](key, mapOutput[key], reduceEmitter);
            };
            job['callback'](reduceOutput);
        }
    };
    var _createJob = function(data, map, callback, options) {
        var job = {
            data: data,
            map: map,
            callback: callback
        };
        if (options) {
            if (options['reduce']) {
                job['reduce'] = options['reduce']
            }
            if (options['inputFormat']) {
                job['inputFormat'] = options['inputFormat']
            }
        }
        return job;
    };
    return {
        submitJob: _submitJob,
        createJob: _createJob
    };
}();
