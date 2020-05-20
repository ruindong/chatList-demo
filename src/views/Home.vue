<template>
  <div class="page">
    <message-list :searchFn="getDate"></message-list>
  </div>
</template>

<script>
import messageList from "../components/messageList";
export default {
  name: 'Home',
  data () {
    return {
      dataBase: [] //总数据源
    }
  },
  components: {
    messageList
  },
  methods: {
    generateUUID (len) {
      len = len || 32;
      const $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
      const maxPos = $chars.length;
      let uuid = "";
      for (let i = 0; i < len; i++) {
        uuid += $chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return uuid;
    },
    createDataBase (len) { //虚拟数据生成
      const infinityData = [];
      for (let i = len; i > 0; i--) {
        const key  = parseInt(Math.random()*3);
        const userId = parseInt(Math.random()*2);
        const uuid = this.generateUUID(16);
        switch (key) {
          case 0: infinityData.push({type: "text", uuid: uuid, userId: userId,  msg: "这是一条文本消息" + i}); break;
          case 1: infinityData.push({type: "img", uuid: uuid, userId: userId, msg: i, src: "img/result.jpg"}); break;
          case 2: infinityData.push({type: "system", uuid: uuid, userId: userId, msg: "这是一条系统消息" + i}); break;
        }
      }
      return infinityData;
    },
    getDate (pageSize, pageNo) { // 模拟请求方法-将方法传入渲染组件供调用
      if (pageSize === 0 || pageNo === 0) return [];
      const data = this.dataBase.slice(pageSize * (pageNo - 1), pageSize * pageNo);
      return data.reverse();
    }
  },
  created() {
    this.dataBase = this.createDataBase(100); //构造总数据量-模拟数据库
  }
}
</script>
