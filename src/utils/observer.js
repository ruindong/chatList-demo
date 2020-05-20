export const Observer = (() => {
    const _messages = {}; //消息队列
    return {
        on: (type, fn) => { //订阅
            if (typeof _messages[type] === "undefined") {
                _messages[type] = [fn];
            } else {
                _messages[type].push(fn);
            }
        },
        emit: (type, args) => { //发布
            if(!_messages[type]) return false;
            const events = {
                type: type,
                args: args || {}
            };
            for (let i = 0; i < _messages[type].length; i++) {
                _messages[type][i].call(this, events);
            }
        },
        remove: (type, fn) => {
            if (_messages[type] instanceof  Array) {
                for (let i = _messages[type].length - 1; i >= 0; i--) {
                    _messages[type][i] = fn && _messages[type].splice(i, 1);
                }
            }
        }
    }
})();





