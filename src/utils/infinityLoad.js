/**
 * 解决滚动框一次性加载大量数据会造成卡顿的情况，采取批量加载的方式，当用户展示满4页的数据之后再有新的数据
 * 那么就增加第五页数据的同时会删除第一页的数据，始终保持滚动框内只有4页数据的情况，相反往上加载的时候也需要
 * 增加头部数据同时减去底部数据。同时，滚动条要和真实情况匹配
 * 待改进地方，触及顶部和底部增加的数据让滚动条定位不准确，导致页面产生跳一下
 * 待改进地方，不能触顶和触底时候在加载数据，应该要提前，让滚动平滑
 * 写这个demo刚好工作在转测周，写得比较粗糙
 */
export default function infinityLoad (options, callback) {
    this.option = {
        needDrawData: [],
        prePageNo: 1, //需要渲染的数据列表前置15条数据归属第几页
        nextPageNo: 1, //需要渲染的数据列表后置15条数据归属第几页
        onloadFlag: false, //下锁等待渲染完毕-锁
        downLoadDataFlag: false, //下滑数据已经请求完-锁
        pageSize: 15, //每一页的数据量
        pageNo: 1, //加载页
        scrollDom: document.body, //滚动的dom
        searchFn: null, //数据请求的方法
        VueThis: null //vue页面的this
    };
    let combineJson = (source, target) => {
        for (let key in target) {
            source[key] = target[key];
        }
    };
    let createInitData = () => { //获取初始化数据
        this.option.needDrawData = this.option.searchFn(this.option.pageSize, this.option.pageNo);
        callback(this.option.needDrawData);
    };
    let throttle = (fn, delay, atleast) =>  {//函数绑定在 scroll 事件上，当页面滚动时，避免函数被高频触发，
        let timeout = null; //进行去抖处理
        let startTime = new Date();
        return function () {
            let curTime = new Date();
            clearTimeout(timeout);
            if (curTime - startTime >= atleast) {
                fn();
                startTime = curTime;
            } else {
                timeout = setTimeout(fn, delay);
            }
        }
    };
    let lazyLoad = () => {
        const scrollTop = this.option.scrollDom.scrollTop;
        if (scrollTop === 0 && !this.option.onloadFlag && !this.option.downLoadDataFlag) {
            this.option.onloadFlag = true;
            const setTopData = this.option.searchFn(this.option.pageSize, (this.option.prePageNo + 1));
            if (setTopData.length < this.option.pageSize) {
                this.option.downLoadDataFlag = true; //已经没有数据可以加载，加锁
            }
            this.option.prePageNo ++;
            let dataList = setTopData.concat(this.option.needDrawData);
            if ((this.option.prePageNo - this.option.nextPageNo + 1) === 5) { //如果头部追加一页数据导致总页数=5,就删除尾部一页数据保证列表最多只有4页数据
                dataList = dataList.slice(0, (dataList.length - this.option.pageSize));
                this.option.nextPageNo ++
            }
            this.option.needDrawData = dataList;
            callback(this.option.needDrawData);
            console.log("首部是第"+ this.option.prePageNo + "页，尾部是第" + this.option.nextPageNo + "页",  this.option.needDrawData);
            this.option.VueThis.$nextTick(() => { //数据更新到dom后更新滚动距离
                this.option.scrollDom.scrollTop = this.option.VueThis.$refs.messageItem[this.option.pageSize].offsetTop;
                this.option.onloadFlag = false;
            })
        }
        const screenHeight = this.option.scrollDom.clientHeight;
        const scrollHeight = this.option.scrollDom.scrollHeight;
        if (scrollHeight - scrollTop -screenHeight === 0 && !this.option.onloadFlag) {
            this.option.downLoadDataFlag = false; //存在向下加载解除向上数据加载的锁
            if (this.option.nextPageNo === 1) return false;
            const setTopData = this.option.searchFn(this.option.pageSize, (this.option.nextPageNo - 1));
            this.option.nextPageNo --;
            let dataList = this.option.needDrawData.concat(setTopData);
            if ((this.option.prePageNo - this.option.nextPageNo + 1) === 5) { //如果头部追加一页数据导致总页数=5,就删除尾部一页数据保证列表最多只有4页数据
                const offsetData = (dataList.length - (this.option.pageSize * 4));
                dataList = dataList.slice(offsetData);
                this.option.prePageNo --;
            }
            this.option.needDrawData = dataList;
            callback(this.option.needDrawData);
            console.log("首部是第"+ this.option.prePageNo + "页，尾部是第" + this.option.nextPageNo + "页",  this.option.needDrawData);
            this.option.VueThis.$nextTick(() => { //数据更新到dom后更新滚动距离
                this.option.scrollDom.scrollTop = this.option.VueThis.$refs.messageItem[this.option.needDrawData.length - this.option.pageSize].offsetTop - screenHeight;
                this.option.onloadFlag = false;
            })
        }
    };
    let stopInfinity = () => {
        if (!this.option.scrollDom) return false;
        // 取消监听事件，去掉头部和底部的bottom
        this.option.scrollDom.removeEventListener('scroll', throttle);
    };
    let startInfinity = () => {
        stopInfinity();
        if (!this.option.scrollDom) return false;
        lazyLoad();
        this.option.scrollDom.addEventListener('scroll', throttle(lazyLoad, 200, 500));
    };
    this.init = () => {
        combineJson(this.option, options);
        createInitData();
        startInfinity()
    };
}
