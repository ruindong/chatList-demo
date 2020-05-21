<template lang="html">
    <div @click="revocationHandle" :class="msgSource ? 'show-left': 'show-right'">
        <div class="text-msg">{{item.msg}}</div>
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
            // 按字母顺序
            msgSource: {
                type: Boolean,
                default: false
            },
            item: {
                type: Object,
                default: {}
            },
            revocation: {
                type: Function,
                required: true
            }
        },
        // 变量
        data() {
            return {};
        },
        computed: {},

        asyncComputed: {},

        // 使用其它组件
        components: {},

        // 方法
        watch: {},
        methods: {
            revocationHandle () {
                this.revocation(this.item);
            }
        },
        // 生命周期函数
        created() {
        },
        beforeCreate() {
        },
        mounted() {
        }
    };
</script>
<style lang="less" scoped>
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
    .text-msg{
        background-color: #95EC69;
        border-radius: 4px;
        padding: 10px;
        display: inline-block;
        max-width: 300px;
    }
</style>
