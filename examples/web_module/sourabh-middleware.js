module.exports.parse = function (data) {
    data = data.replace("{{Date}}", Date());

    return data;
};