class ProductionConfig {
  constructor() {
    this.cq = {
      apiRoot: 'http://127.0.0.1:5700/',
      accessToken: '',
      secret: ''
    }
    //this.cq_path = ''
    this.cq_img_path = 'E:\\ProgramTools\\酷Q Pro\\data\\image\\'
    //this.cq_post_ip = '172.17.0.1'
    this.cq_post_ip = '127.0.0.1'
    this.cq_post_port = 5600

    this.admin_qq = 156890093
    this.admin_group = 375633774
    
    
  }
}

module.exports = ProductionConfig