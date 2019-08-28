const CQHttp = require('cqhttp')
const moment = require('moment')
const config = require('./config')

class QQ {

  constructor(
      rcvAdminMsg      = (msg)              =>{},
      rcvAdminGroupMsg = (uid,name,msg)     =>{},
      rcvMsg           = (uid,name,msg)     =>{},
      rcvGroupMsg      = (gid,uid,name,msg) =>{},

  ){

    this.bot = new CQHttp(config.cq)

    this.bot.on('message', context => {

      if(context.message_type === 'private'){

        var rtn = 
          ((context.sender.user_id === config.admin_qq) && config.admin_qq) ? 
          rcvAdminMsg (context.message) : 
          rcvMsg      (context.sender.user_id,context.sender.nickname,context.message)

        console.log('\x1b[32m%s\x1b[32m\x1b[0m%s\x1b[0m','RCV:',JSON.stringify(context))

        if(rtn !== null) this.sendMsg(context.sender.user_id,rtn)

      }

      else if(context.message_type === 'group') {

        var rtn = 
          ((context.group_id === config.admin_group) && config.admin_group) ?
          rcvAdminGroupMsg (context.sender.user_id,context.sender.nickname,context.message) : 
          rcvGroupMsg      (context.group_id,context.sender.user_id ,context.sender.nickname,context.message)

        console.log('\x1b[32m%s\x1b[32m\x1b[0m%s\x1b[0m','RCV(GROUP):',JSON.stringify(context))

        if(rtn !== null) this.sendGroupMsg(context.group_id,rtn)
        
      }
    })

    this.bot.listen(config.cq_post_port, '127.0.0.1')
  }

  log(msg,toGroup=false) {

    var message = `Nyanbot log(${moment().format('YYYY/MM/DD hh:mm:ss')}):\n${msg}`

    if      (  toGroup && config.admin_group ) this.sendGroupMsg(config.admin_group,message )
    else if ( !toGroup && config.admin_qq    ) this.sendMsg     (config.admin_qq,   message )
    else    console.log('\x1b[31m%s\x1b[31m\x1b[0m%s\x1b[0m', 'QQLOG FALLBACK(Did you set admin_qq/admin_group?):', msg)

  }

  async sendMsg(id,message){
    var context = { user_id:id, message }
    try {
      await this.bot('send_msg',context)
      console.log('\x1b[32m%s\x1b[32m\x1b[0m%s\x1b[0m', 'SEND:', JSON.stringify(context))
    } catch (e) {
      if(e.status!== 200 && e.retcode!== 100) console.log('\x1b[31m%s\x1b[31m\x1b[0m%s\x1b[0m', 'SEND EXCEPTION:', JSON.stringify(e))
    }
  }

  async sendGroupMsg(id,message){
    var context = { group_id:id, message }
    try {
      await this.bot('send_msg', context)
      console.log('\x1b[32m%s\x1b[32m\x1b[0m%s\x1b[0m', 'SEND(GROUP):', JSON.stringify(context))
    } catch (e) {
      if(e.status!== 200 && e.retcode!== 100) console.log('\x1b[31m%s\x1b[31m\x1b[0m%s\x1b[0m', 'SEND(GROUP) EXCEPTION:', JSON.stringify(e))
    }
  }
}

module.exports = QQ