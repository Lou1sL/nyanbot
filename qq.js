const CQHttp = require('cqhttp')
const moment = require('moment')
const config = require('./config')

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

  async log(msg,toGroup=false) {

    var message = `Nyanbot log(${moment().format('YYYY/MM/DD hh:mm:ss')}):\n${msg}`

    if      (  toGroup && config.admin_group ) return await this.sendGroupMsg(config.admin_group,message )
    else if ( !toGroup && config.admin_qq    ) return await this.sendMsg     (config.admin_qq,   message )
    else if ( this.logLevel <= 1 ) console.log('\x1b[31m%s\x1b[31m\x1b[0m%s\x1b[0m', '🤔  QQLOG FALLBACK(Did you set admin_qq/admin_group?):', msg)
    
  }

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

  fetchCQImages(message){
    var regex = /\[CQ:image,file=.*?,url=(.*?)\]/g
    var img_list = []

    var nxt = regex.exec(message)
    while(nxt){ img_list.push(nxt[1]); message.replace(nxt); nxt = regex.exec(message)  }
    
    return img_list
  }

  CQShare(url,title,content,image){
    return `[CQ:share,url=${url},title=${title},content=${content},image=${image}]`
  }

  CQImage(path){
    return `[CQ:image,file=${path},url=${path}]`
  }
}

module.exports = QQ