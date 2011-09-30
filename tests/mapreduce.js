describe('MapReduce', function() {

    it('should return {0:[2],1:[4],2:[6],3:[8]} for ([1,2,3,4], (k,v) -> emit(k,v*2))', function() {
        var output = ganesha([1,2,3,4], function(key, value, emit) {
            emit(key, value * 2);
        });
        expect(output).toEqual({0:[2],1:[4],2:[6],3:[8]});
    });

    it('should return "in" as the most frequent word', function() {
        var text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque commodo porta facilisis. Sed pretium velit facilisis enim feugiat ut bibendum orci elementum. Fusce mattis, ante id porta adipiscing, orci mauris ultricies enim, in tincidunt erat mauris eget arcu. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi metus tellus, euismod nec consectetur in, malesuada eget purus. In placerat sapien a purus tempor hendrerit. Quisque vel mi euismod orci tristique auctor non ac nunc. Nam sit amet nunc erat. Mauris dictum augue non lectus tincidunt quis interdum nunc convallis. Suspendisse eleifend, leo at cursus hendrerit, nisl leo faucibus turpis, vitae volutpat massa nisi in erat. Morbi dictum nunc nec erat aliquet adipiscing sed id dolor.";
        var output = ganesha(text, function(key, value, emit) {
            emit(value, 1);
        }, function(key, values, emit) {
            var n = 0;
            values.forEach(function(value) {
                n += value;
            });
            emit(key, n);
        }, function(data) {
            return data.toLowerCase().substr(0, data.length - 1).split(/[,.]? /);
        });
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
        expect(mostFrequentWord.word).toEqual('in');
    });

});
