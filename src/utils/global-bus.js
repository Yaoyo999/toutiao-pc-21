// event-bus 非父子组件通过V新的Vue实例来传递参数,接收数据的一方通过global.$on('方法名',function(data){})
// 发送数据的一方通过global.$emit('事件名',数据)

import Vue from 'vue'

export default new Vue()
