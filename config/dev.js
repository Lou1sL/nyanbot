class DevelopmentConfig {
  constructor() {

    //酷Q配置
    this.cq = {
      //酷Q程序的图片上传根目录
      //img_path : '',
      img_path: 'E:\\ProgramTools\\酷Q Pro\\data\\image\\',

      //发送酷Q消息api
      send: {
        apiRoot: 'http://127.0.0.1:5700/',
        accessToken: '',
        secret: ''
      },

      //接收酷Q消息api
      rcv: {
        //api:'172.17.0.1',
        api:'127.0.0.1',
        port: 5600
      },

      //admin相关
      admin: {
        qq:156890093,
        group:375633774
      }

    }

    //Github配置
    this.github = {

      //登录信息
      auth:{
      },

      //组织
      org:'shou-ca'
    }
  }
}

module.exports = DevelopmentConfig