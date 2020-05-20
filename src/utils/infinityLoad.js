/**
 * 解决滚动框一次性加载大量数据会造成卡顿的情况，采取批量加载的方式，当用户展示满4页的数据之后再有新的数据
 * 那么就增加第五页数据的同时会删除第一页的数据，始终保持滚动框内只有4页数据的情况，相反往上加载的时候也需要
 * 增加头部数据同时减去底部数据。同时，滚动条要和真实情况匹配
 */
function infinityLoad (option, callback) {
    this.option = {
        needDrawData: [],
        prePageNo: 1, //需要渲染的数据列表前置15条数据归属第几页
        nextPageNo: 1, //需要渲染的数据列表后置15条数据归属第几页
        onloadFlag: false, //下锁等待渲染完毕-锁
        downLoadDataFlag: false, //下滑数据已经请求完-锁
        pageSize: 15,
        pageNo: 1,
        dom: document.body
    };
    let combineJson = function (source, target) {
        for (let key in target) {
            source[key] = target[key];
        }
    };
    this.init = function () {
        combineJson(this.option, options);
    }
}
