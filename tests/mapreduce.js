describe("MapReduce", function () {

    var noop, defaultMapFunction;

    noop = function () {};
    defaultMapFunction = function (key, value, emit) {
        emit(key, value);
    };

    it("should fail for no arguments", function () {
        expect(function () {
            ganesha.submitJob();
        }).toThrow("Please provide a job description.");
    });

    it("should fail for empty job description", function () {
        expect(function () {
            ganesha.submitJob(ganesha.createJob());
        }).toThrow("Please provide an input data object or array.");
    });

    it("should fail if map and callback are not defined", function () {
        expect(function () {
            ganesha.submitJob(ganesha.createJob([1,2,3,4]));
        }).toThrow("Please provide a map function.");
    });

    it("should fail if callback is not defined", function () {
        expect(function () {
            ganesha.submitJob(ganesha.createJob([1,2,3,4], defaultMapFunction));
        }).toThrow("Please provide a callback function.");
    });

    it("should fail if the input data is not an object or an array", function () {
        expect(function () {
            ganesha.submitJob(ganesha.createJob("fail", defaultMapFunction, noop));
        }).toThrow("Please provide an input data object or array.");
    });

    it("should return 'in' as the most frequent word", function () {
        var text;
        text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque commodo porta facilisis. Sed pretium velit facilisis enim feugiat ut bibendum orci elementum. Fusce mattis, ante id porta adipiscing, orci mauris ultricies enim, in tincidunt erat mauris eget arcu. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi metus tellus, euismod nec consectetur in, malesuada eget purus. In placerat sapien a purus tempor hendrerit. Quisque vel mi euismod orci tristique auctor non ac nunc. Nam sit amet nunc erat. Mauris dictum augue non lectus tincidunt quis interdum nunc convallis. Suspendisse eleifend, leo at cursus hendrerit, nisl leo faucibus turpis, vitae volutpat massa nisi in erat. Morbi dictum nunc nec erat aliquet adipiscing sed id dolor.";
     // Normalize text.
        text = text.toLowerCase().substr(0, text.length - 1).split(/[,.]? /);
        ganesha.submitJob(ganesha.createJob(text, function (key, value, emit) {
            emit(value, 1);
        }, function (output) {
            var mostFrequentWord;
            for (var word in output) {
                if (!mostFrequentWord) {
                    mostFrequentWord = {
                        word: word,
                        frequency: output[word]
                    };
                }
                if (output[word] > mostFrequentWord.frequency) {
                    mostFrequentWord.word = word;
                    mostFrequentWord.frequency = output[word];
                }
            };
            expect(mostFrequentWord.word).toEqual("in");
        }, {
            reduce: function (key, values, emit) {
                var n = 0;
                values.forEach(function (value) {
                    n += value;
                });
                emit(key, n);
            }
        }));
    });

    it("should return [2,4,6,8] for a job that doubles every element in [1,2,3,4]", function () {
        ganesha.submitJob(ganesha.createJob([1,2,3,4], function (key, value, emit) {
            emit(key, value * 2);
        }, function (output) {
            expect(output).toEqual({0:[2],1:[4],2:[6],3:[8]});
        }));
    });

});
