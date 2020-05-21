<template lang="html">
    <div class="message-list" ref="messageList">
        <div class="top" ref="top"></div>
        <div v-for="item in needDrawData" ref="messageItem">
            <img-msg v-if="item.type === 'img' && showImgMsg" :revocation="revocation" :item="item" :msgSource="item.userId === 0"></img-msg>
            <text-msg v-if="item.type === 'text' && showTextMsg" :revocation="revocation" :item="item" :msgSource="item.userId === 0"></text-msg>
            <sys-msg v-if="item.type === 'system' && showSysMsg" :item="item"></sys-msg>
        </div>
        <div class="bottom" ref="bottom"></div>
    </div>
</template>

<script>
    import infinityLoad from "../utils/infinityLoad"
    import imgMsg from "./imgMsg";
    import textMsg from "./textMsg";
    import sysMsg from "./sysMsg";
    export default {
        components: {
            imgMsg, textMsg, sysMsg
        },
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
            },
            showImgMsg: {
                type: Boolean,
                default: true
            },
            showTextMsg: {
                type: Boolean,
                default: true
            },
            showSysMsg: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                needDrawData: []
            };
        },
        methods: {
            callback (res) {
                this.needDrawData = res;
            },
            revocation (item) { //消息撤回
                console.log(item);
                item.type = "system";
                item.msg = "消息已撤回";
                this.$emit("revocationMsg", item);
            },
        },
        mounted () {
            const options = {
                pageSize: this.pageSize,
                pageNo: this.pageNo,
                searchFn: this.searchFn,
                scrollDom: this.$refs.messageList,
                VueThis: this
            };
            const infinityLoadFn = new infinityLoad(options, this.callback);
            infinityLoadFn.init();
        }
    }
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
