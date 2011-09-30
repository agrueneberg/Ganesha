var ganesha = function() {
    /**
     * Submits a job.
     */
    var _submitJob = function(job) {
        if (!job || job.constructor !== _Job) {
            throw 'Please provide a job description.';
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
    /**
     * Creates a new job.
     */
    var _createJob = function(data, map, callback, options) {
        return new _Job(data, map, callback, options);
    };
    /**
     * Job class
     */
    var _Job = function(data, map, callback, options) {
        if (!data || !Array.isArray(data)) {
            throw 'Please provide an input data array.';
        }
        if (!map || typeof map !== 'function') {
            throw 'Please provide a map function.';
        }
        if (!callback || typeof callback !== 'function') {
            throw 'Please provide a callback function.';
        }
        this.data = data;
        this.map = map;
        this.callback = callback;
        if (options && options['reduce'] && typeof options['reduce'] === 'function') {
            this.reduce = options['reduce'];
        }
    };
    return {
        submitJob: _submitJob,
        createJob: _createJob
    };
}();
