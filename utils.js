module.exports.parseFilter = function(query) {
    if (typeof query !== 'string') return [];
    var reg = /(\w*)(=@|==)(\w*)(?:,|$)*/g;
    var res;
    var result = {};
    while ((res = reg.exec(query)) !== null) {
        if (res[1] || res[2] || res[3]) {
            result[res[1]] = new RegExp(res[3], 'i');
        }
    }
    return result;
};