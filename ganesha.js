/**
 * Ganesha is a browser-based implementation of MapReduce.
 */
(function (exports) {
    "use strict";

    var toType, Job, submitJob, createJob;

    // See: https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
    toType = function (obj) {
        return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
    };

    Job = function (data, map, callback, options) {
        this.dataType = toType(data);
        if (this.dataType !== "object"  && this.dataType !== "array") {
            throw "Please provide an input data object or array.";
        }
        if (toType(map) !== "function") {
            throw "Please provide a map function.";
        }
        if (toType(callback) !== "function") {
            throw "Please provide a callback function.";
        }
        this.data = data;
        this.map = map;
        this.callback = callback;
        if (toType(options) === "object" && toType(options.reduce) === "function") {
            this.reduce = options.reduce;
        }
    };

    exports.submitJob = submitJob = function (job) {
        var mapOutput, reduceOutput, mapEmitter, reduceEmitter, key;
        if (toType(job) !== "object" || job.constructor !== Job) {
            throw "Please provide a job description.";
        }
        mapOutput = {};
        reduceOutput = {};
        mapEmitter = function (key, value) {
            if (!mapOutput[key]) {
                mapOutput[key] = [];
            }
            mapOutput[key].push(value);
        };
        reduceEmitter = function (key, value) {
            if (reduceOutput[key] === undefined) {
                reduceOutput[key] = [];
            }
            reduceOutput[key].push(value);
        };
        if (job.dataType === "object") {
         // The input is an object.
            Object.keys(job.data).forEach(function (key) {
                job.map(key, job.data[key], mapEmitter);
            });
        } else {
         // The input is an array.
            job.data.forEach(function (element, index) {
                job.map(index, element, mapEmitter);
            });
        }
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

    exports.createJob = function (data, map, callback, options) {
        return new Job(data, map, callback, options);
    };

}(this.ganesha = {}));
