<template lang="html">
    <div class="message-list" ref="messageList">
        <div class="top" ref="top"></div>
        <div v-for="item in needDrawData" ref="messageItem">
            <div @click="revocation(item)"
                 :class="item.userId === 0 ? 'show-left': 'show-right'" class="img-msg"
                 v-if="item.type === 'img'">
                <img v-lazy="item.src">
            </div>
            <div @click="revocation(item)"
                 :class="item.userId === 0 ? 'show-left': 'show-right'"
                 v-else-if="item.type === 'text'">
                <div class="text-msg">{{item.msg}}</div>
            </div>
            <div class="sys-msg" v-else>{{item.msg}}</div>
        </div>
        <div class="bottom" ref="bottom"></div>
    </div>
</template>

<script>
    export default {
        // 不要忘记了 name 属性
        name: "",
        // 组合其它组件
        extends: {},

        // 组件属性、变量
        props: {
            searchFn: {
                type: Function,
                required: true
            },
            pageSize: {
                type: Number,
                default: 15
            },
            pageNo: {
                type: Number,
                default: 1
            }
        },
        // 变量
        data() {
            return {
                needDrawData: [],
                prePageNo: 1, //需要渲染的数据列表前置15条数据归属第几页
                nextPageNo: 1, //需要渲染的数据列表后置15条数据归属第几页
                onloadFlag: false, //下锁等待渲染完毕-锁
                downLoadDataFlag: false //下滑数据已经请求完-锁
            };
        },
        computed: {},

        asyncComputed: {},

        // 使用其它组件
        components: {},

        // 方法
        watch: {},
        methods: {
            revocation (item) {
                console.log(item);
                item.type = "system";
                item.msg = "消息已撤回";
            },
            throttle (fn, delay, atleast) {//函数绑定在 scroll 事件上，当页面滚动时，避免函数被高频触发，
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
            },
            lazyLoad () {
                const scrollTop = this.$refs.messageList.scrollTop;
                if (scrollTop === 0 && !this.onloadFlag && !this.downLoadDataFlag) {
                    this.onloadFlag = true;
                    const setTopData = this.searchFn(this.pageSize, (this.prePageNo + 1));
                    if (setTopData.length < this.pageSize) {
                        this.downLoadDataFlag = true; //已经没有数据可以加载，加锁
                    }
                    this.prePageNo ++;
                    let dataList = setTopData.concat(this.needDrawData);
                    if ((this.prePageNo - this.nextPageNo + 1) === 5) { //如果头部追加一页数据导致总页数=5,就删除尾部一页数据保证列表最多只有4页数据
                        dataList = dataList.slice(0, (dataList.length - this.pageSize));
                        this.nextPageNo ++
                    }
                    this.needDrawData = dataList;
                    console.log("首部是第"+ this.prePageNo + "页，尾部是第" + this.nextPageNo + "页",  this.needDrawData);
                    this.$nextTick(() => { //数据更新到dom后更新滚动距离
                        this.$refs.messageList.scrollTop = this.$refs.messageItem[this.pageSize].offsetTop;
                        this.onloadFlag = false;
                    })
                }
                const screenHeight = this.$refs.messageList.clientHeight;
                const scrollHeight = this.$refs.messageList.scrollHeight;
                if (scrollHeight - scrollTop -screenHeight === 0 && !this.onloadFlag) {
                    this.downLoadDataFlag = false; //存在向下加载解除向上数据加载的锁
                    if (this.nextPageNo === 1) return false;
                    const setTopData = this.searchFn(this.pageSize, (this.nextPageNo - 1));
                    this.nextPageNo --;
                    let dataList = this.needDrawData.concat(setTopData);
                    if ((this.prePageNo - this.nextPageNo + 1) === 5) { //如果头部追加一页数据导致总页数=5,就删除尾部一页数据保证列表最多只有4页数据
                        const offsetData = (dataList.length - (this.pageSize * 4));
                        dataList = dataList.slice(offsetData);
                        this.prePageNo --;
                    }
                    this.needDrawData = dataList;
                    console.log("首部是第"+ this.prePageNo + "页，尾部是第" + this.nextPageNo + "页",  this.needDrawData);
                    this.$nextTick(() => { //数据更新到dom后更新滚动距离
                        this.$refs.messageList.scrollTop = this.$refs.messageItem[this.needDrawData.length - this.pageSize].offsetTop - screenHeight;
                        this.onloadFlag = false;
                    })
                }
            }
        },
        updated() {
        },
        // 生命周期函数
        created() {
            this.needDrawData = this.searchFn(this.pageSize, this.pageNo); //获取初始化数据
        },
        beforeCreate() {
        },
        mounted() {
            this.lazyLoad(); //初始化就滚动到顶部，即向上加载一页数据；
            const messageList = this.$refs.messageList;
            messageList.addEventListener('scroll',this.throttle(this.lazyLoad, 200, 500), false);
        }
    };
</script>
<style scoped lang="less">
    .message-list{
        width: 100%;
        height: 100vh;
        overflow-y: scroll;
        background-color: #EDEDED;
        div{margin-bottom: 20px}
        .show-left{
            display: flex;
            align-content: center;
            justify-content: flex-start;
        }
        .show-right{
            display: flex;
            align-content: center;
            justify-content: flex-end;
        }
        .img-msg{
            height: 100px;
            img {
                display: block;
                margin-bottom: 20px;
                height: 100px;
            }
        }
        .text-msg{
            background-color: #95EC69;
            border-radius: 4px;
            padding: 10px;
            display: inline-block;
            max-width: 300px;
        }
        .sys-msg{
            color: #C8C8C8;
        }
    }
</style>
