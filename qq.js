const CQHttp = require('cqhttp')
const moment = require('moment')
const fs     = require('fs')
const config = require('./config')

/**
 * QQ API主类
 */
class QQ {

  constructor(
      rcvAdminMsg      = (msg)              =>{},
      rcvAdminGroupMsg = (uid,name,msg)     =>{},
      rcvMsg           = (uid,name,msg)     =>{},
      rcvGroupMsg      = (gid,uid,name,msg) =>{},
      logLevel         = 1                        // 0:Show everything 1:Error only 2:Keep silence
  ){

    this.bot = new CQHttp(config.cq)

    this.logLevel = logLevel
    this.str = new QQStr()

    this.bot.on('message', context => {

      if(context.message_type === 'private'){

        var rtn = 
          ((context.sender.user_id === config.admin_qq) && config.admin_qq) ? 
          rcvAdminMsg (context.message) : 
          rcvMsg      (context.sender.user_id,context.sender.nickname,context.message)

        if (logLevel <= 0) console.log('\x1b[32m%s\x1b[32m\x1b[0m%s\x1b[0m', '⬇️  RCV:', JSON.stringify(context))

        if(rtn !== null) this.sendMsg(context.sender.user_id,rtn)

      }

      else if(context.message_type === 'group') {

        var rtn = 
          ((context.group_id === config.admin_group) && config.admin_group) ?
          rcvAdminGroupMsg (context.sender.user_id,context.sender.nickname,context.message) : 
          rcvGroupMsg      (context.group_id,context.sender.user_id ,context.sender.nickname,context.message)

          if (logLevel <= 0) console.log('\x1b[32m%s\x1b[32m\x1b[0m%s\x1b[0m','⬇️  RCV(GROUP):',JSON.stringify(context))

        if(rtn !== null) this.sendGroupMsg(context.group_id,rtn)

      }
    })

    this.bot.listen(config.cq_post_port, config.cq_post_ip)
  }

  /**
   * 发送log消息到 adminQQ 或 admin群（在config中配置）
   * @param {string} msg 消息内容
   * @param {boolean} toGroup 是否是发送到admin群
   */
  async log(msg,toGroup=false) {

    var message = `Nyanbot log(${moment().format('YYYY/MM/DD hh:mm:ss')}):\n${msg}`

    if      (  toGroup && config.admin_group ) return await this.sendGroupMsg(config.admin_group,message )
    else if ( !toGroup && config.admin_qq    ) return await this.sendMsg     (config.admin_qq,   message )
    else if ( this.logLevel <= 1 ) console.log('\x1b[31m%s\x1b[31m\x1b[0m%s\x1b[0m', '🤔  QQLOG FALLBACK(Did you set admin_qq/admin_group?):', msg)
    
  }

  /**
   * 发送消息到个人
   * @param {string} id QQ号
   * @param {string} message 消息内容
   */
  async sendMsg(id,message){
    var context = { user_id:id, message }
    var mid = null
    try {
      mid = await this.bot('send_msg',context)
      if (this.logLevel <= 0) console.log('\x1b[32m%s\x1b[32m\x1b[0m%s\x1b[0m', '⬆️  SEND:', JSON.stringify(context))
    } catch (e) {
      if((e.status!== 200 || e.retcode!== 100) && this.logLevel <= 1) console.log('\x1b[31m%s\x1b[31m\x1b[0m%s\x1b[0m', '🤔  SEND EXCEPTION:', JSON.stringify(e))
    }
    return mid
  }

  /**
   * 发送消息到群
   * @param {string} id 群号
   * @param {string} message 消息内容
   */
  async sendGroupMsg(id,message){
    var context = { group_id:id, message }
    var mid = null
    try {
      mid = await this.bot('send_msg', context)
      if (logLevel <= 0) console.log('\x1b[32m%s\x1b[32m\x1b[0m%s\x1b[0m', '⬆️  SEND(GROUP):', JSON.stringify(context))
    } catch (e) {
      if((e.status!== 200 || e.retcode!== 100) && this.logLevel <= 1) console.log('\x1b[31m%s\x1b[31m\x1b[0m%s\x1b[0m', '🤔  SEND(GROUP) EXCEPTION:', JSON.stringify(e))
    }
    return mid
  }

  

  
}

/**
 * 特殊cq码字符串生成/提取（QQ类的静态子类）
 */
class QQStr{
  
  /**
   * 构造分享链接的特殊字符串
   * @param {string} url url链接
   * @param {string} title 标题
   * @param {string} content 简介（标题下方的小字）
   * @param {string} image 图片（URL）
   * @return {string}
   */
  share(url,title,content,image){
    return `[CQ:share,url=${url},title=${title},content=${content},image=${image}]`
  }
  
  /**
   * 构造发送图片的特殊字符串
   * @param {string,array} path 图片路径（可以是URL\本地路径的str、也可是由上者构成的str arr）
   * @return {string}
   */
  image(path){
    var regex = new RegExp('^(https?:\\/\\/)?'         + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'                      + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'                  + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'                         + // query string
    '(\\#[-a-z\\d_]*)?$','i')                            // fragment locator
    var ret = ""
    if(Array.isArray(path)){
      path.forEach((item,index,array)=>{
            if(regex.test(item)){
              var newname = Date.now()
              fs.copyFileSync(item,config.cq_img_path+newname)
              ret += `[CQ:image,file=${newname}]`
            }else{
              ret += `[CQ:image,url=${item}]`
            }
          }
        )
    }else{
      if(regex.test(path)){
        var newname = Date.now()
        fs.copyFileSync(path,config.cq_img_path+newname)
        ret = `[CQ:image,file=${newname}]`
      }else{
        ret = `[CQ:image,url=${path}]`
      }
    }
    return ret
  }

  /**
   * 获取QQ消息中的全部图片并返回其url构成的数组
   * @param {string} message QQ消息原文
   * @return {array}
   */
  getImageURL(message){
    var regex = /\[CQ:image,file=.*?,url=(.*?)\]/g
    var img_list = []
    var nxt = regex.exec(message)
    while(nxt){ img_list.push(nxt[1]); message.replace(nxt); nxt = regex.exec(message)  }
    
    return img_list
  }
}

module.exports = QQ