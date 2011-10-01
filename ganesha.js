/*jslint white: true, nomen: true, newcap: true */

var ganesha = (function() {
    "use strict";
    /**
     * Declarations
     */
    var _Job, _submitJob, _createJob;
    /**
     * Job class
     */
    _Job = function(data, map, callback, options) {
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
        if (options && options.reduce && typeof options.reduce === 'function') {
            this.reduce = options.reduce;
        }
    };
    /**
     * Submits a job.
     */
    _submitJob = function(job) {
        var mapOutput, reduceOutput, mapEmitter, reduceEmitter, key;
        if (!job || job.constructor !== _Job) {
            throw 'Please provide a job description.';
        }
        mapOutput = {};
        reduceOutput = {};
        mapEmitter = function(key, value) {
            if (!mapOutput[key]) {
                mapOutput[key] = [];
            }
            mapOutput[key].push(value);
        };
        reduceEmitter = function(key, value) {
            if (reduceOutput[key] === undefined) {
                reduceOutput[key] = [];
            }
            reduceOutput[key].push(value);
        };
        job.data.forEach(function(element, index) {
            job.map(index, element, mapEmitter);
        });
        if (!job.reduce) {
            job.callback(mapOutput);
        } else {
            for (key in mapOutput) {
                if (mapOutput.hasOwnProperty(key)) {
                    job.reduce(key, mapOutput[key], reduceEmitter);
                }
            }
            job.callback(reduceOutput);
        }
    };
    /**
     * Creates a new job.
     */
    _createJob = function(data, map, callback, options) {
        return new _Job(data, map, callback, options);
    };
    return {
        submitJob: _submitJob,
        createJob: _createJob
    };
}());
