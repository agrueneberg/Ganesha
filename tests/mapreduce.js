describe('MapReduce', function() {
  it('should return {0:[2],1:[4],2:[6],3:[8]} for ([1,2,3,4], (k,v) -> emit(k,v*2))', function() {
    var output = mapReduce([1,2,3,4], function(key, value, emit) {
        emit(key, value * 2);
    });
    expect(output).toEqual({0:[2],1:[4],2:[6],3:[8]});
  });
});
