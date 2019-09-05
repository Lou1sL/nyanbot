const CQHttp = require('cqhttp')
const moment = require('moment')
const QQStr  = require('./QQStr')
const config = require('../config')

/**
 * QQ API主类
 */
class QQ {

  constructor(
      rcvAdminMsg      = async (msg)              => {},
      rcvAdminGroupMsg = async (uid,name,msg)     => {},
      rcvMsg           = async (uid,name,msg)     => {},
      rcvGroupMsg      = async (gid,uid,name,msg) => {},
      logLevel         = 1                        // 0:Show everything 1:Error only 2:Keep silence
  ){

    this.bot = new CQHttp(config.cq.send)

    this.logLevel = logLevel
    this.str = new QQStr()

    this.bot.on('message', async context => {

      if(context.message_type === 'private'){

        var rtn = 
          ((context.sender.user_id === config.cq.admin.qq) && config.cq.admin.qq) ? 
          (await (rcvAdminMsg (context.message))) : 
          (await (rcvMsg      (context.sender.user_id,context.sender.nickname,context.message)))

        if (logLevel <= 0) console.log('\x1b[32m%s\x1b[32m\x1b[0m%s\x1b[0m', '⬇️  RCV:', JSON.stringify(context))

        if(rtn !== null) this.sendMsg(context.sender.user_id,rtn)

      }

      else if(context.message_type === 'group') {

        var rtn = 
          ((context.group_id === config.cq.admin.group) && config.cq.admin.group) ?
          (await (rcvAdminGroupMsg (context.sender.user_id,context.sender.nickname,context.message))) : 
          (await (rcvGroupMsg      (context.group_id,context.sender.user_id ,context.sender.nickname,context.message)))

          if (logLevel <= 0) console.log('\x1b[32m%s\x1b[32m\x1b[0m%s\x1b[0m','⬇️  RCV(GROUP):',JSON.stringify(context))

        if(rtn !== null) this.sendGroupMsg(context.group_id,rtn)

      }
    })

    this.bot.listen(config.cq.rcv.port, config.cq.rcv.api)
  }

  /**
   * 发送log消息到 adminQQ 或 admin群（在config中配置）
   * @param {string} msg 消息内容
   * @param {boolean} toGroup 是否是发送到admin群
   */
  async log(msg,toGroup=false) {

    var message = `Nyanbot log(${moment().format('YYYY/MM/DD hh:mm:ss')}):\n${msg}`
    
    if      (  toGroup && config.cq.admin.group ) return await this.sendGroupMsg(config.cq.admin.group,message )
    else if ( !toGroup && config.cq.admin.qq    ) return await this.sendMsg     (config.cq.admin.qq,   message )
    else if ( this.logLevel <= 1 ) console.log('\x1b[31m%s\x1b[31m\x1b[0m%s\x1b[0m', '🤔  QQLOG FALLBACK(Did you set admin qq/admin group?):', msg)
    
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

module.exports = QQ