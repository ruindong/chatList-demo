<template lang="html">
    <div class="sys-msg">{{item.msg}}</div>
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
            item: {
                type: Object,
                default: {}
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
        methods: {},
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
    .sys-msg{
        color: #C8C8C8;
    }
</style>
