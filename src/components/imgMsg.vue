<template lang="html">
    <div @click="revocationHandle" :class="msgSource ? 'show-left': 'show-right'" class="img-msg">
        <img v-lazy="item.src">
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
            // 按字母顺序
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
    .img-msg{
        height: 100px;
        img {
            display: block;
            margin-bottom: 20px;
            height: 100px;
        }
    }
</style>
