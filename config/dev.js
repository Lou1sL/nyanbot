class DevelopmentConfig {
  constructor() {
    this.cq = {
      apiRoot: 'http://127.0.0.1:5700/',
      accessToken: '',
      secret: ''
    }
    this.admin_qq = 156890093
    this.admin_group = 375633774
    //this.cq_post_ip = '172.17.0.1'
    this.cq_post_ip = '127.0.0.1'
    this.cq_post_port = 5600
    
    this.baidu_ak = '1y0GGLNPx43s8mrV9aNq1VkC'
    this.baidu_sk = 'cU2bKS8XmLnFRvDh82MMbm2lOlTuLVac'
  }
}

module.exports = DevelopmentConfig