class ProductionConfig {
  constructor() {
    this.cq = {
      apiRoot: 'http://127.0.0.1:5700/',
      accessToken: '',
      secret: ''
    }
    this.admin_qq = 156890093
    this.admin_group = 375633774
    this.cq_post_ip = '172.17.0.1'
    this.cq_post_port = 5600
  }
}
module.exports = ProductionConfig
  