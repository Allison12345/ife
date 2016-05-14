module.exports = {
    fetch: function (url, resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if(xhr.status === 200){
                    resolve(xhr.response);
                } else {
                    reject();
                }
            } 
        }
        xhr.responseType = 'arraybuffer';
        xhr.send();
    },
    createEle: function (name, className) {
        var ele = document.createElement(name);
        ele.className = className;
        return ele;
    },
    getimgs: function (count, max, baseUrl) {
        var arr = [];
        for (var i = 0; i < count; i++) {
            arr.push(baseUrl + Math.floor(Math.random() * max + 1) + '.png');
        }
        return arr;
    }
}