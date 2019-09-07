const CQHttp = require('cqhttp')
const moment = require('moment')
const QQStr = require('./QQStr')

/**
 * QQ API主类
 */
class QQ {

  /**
   * 创建一个新的QQ实例
   * @param {Object} send_api 发送api（CQ Http API地址）
   * @param {Object} rcv_api 接收api（本程序监听地址）
   * @param {Object} admin_info admin信息
   * @param {Integer} logLevel 控制台日志显示级别（0:全部 1:仅错误 2:无）
   */
  constructor(send_api, rcv_api, admin_info = {}, logLevel = 1) {

    this.bot = new CQHttp(send_api)
    this.str = new QQStr()
    this.logLevel = logLevel

    this.bot.on('message', async context => {

      if (context.message_type === 'private') {

        if (logLevel <= 0) console.log('\x1b[32m%s\x1b[32m\x1b[0m%s\x1b[0m', '⬇️  RCV:', JSON.stringify(context))

        var rtn = await this.rcvMsg(context.sender.user_id, context.sender.nickname, context.message)

        this.sendMsg(context.sender.user_id, rtn)

      }
      else if (context.message_type === 'group') {

        if (logLevel <= 0) console.log('\x1b[32m%s\x1b[32m\x1b[0m%s\x1b[0m', '⬇️  RCV(GROUP):', JSON.stringify(context))

        var rtn = await this.rcvGroupMsg(context.group_id, context.sender.user_id, context.sender.nickname, context.message)

        this.sendGroupMsg(context.group_id, rtn)
      }
    })

    this.bot.listen(rcv_api.port, rcv_api.ip)
  }

  /**
   * 发送adminQQ或admin群消息
   * @param {String} msg 消息内容
   * @param {Boolean} toGroup 是否是发送到admin群
   * @return {String} 发送消息ID
   */
  async log(msg, toGroup = false) {

    var message = `Nyanbot log(${moment().format('YYYY/MM/DD hh:mm:ss')}):\n${msg}`

    if (toGroup && admin_info.group) return await this.sendGroupMsg(admin_info.group, message)
    else if (!toGroup && admin_info.qq) return await this.sendMsg(admin_info.qq, message)
    else if (this.logLevel <= 1) console.log('\x1b[31m%s\x1b[31m\x1b[0m%s\x1b[0m', '🤔  QQLOG FALLBACK(Did you set admin qq/admin group?):', msg)

  }

  /**
   * 发送私聊消息
   * @param {String} id QQ号
   * @param {String} message 消息内容
   * @return {String} 发送消息ID
   */
  async sendMsg(id, message) {

    if (!message) return

    var context = { user_id: id, message }
    var mid = null
    try {
      mid = await this.bot('send_msg', context)
      if (this.logLevel <= 0) console.log('\x1b[32m%s\x1b[32m\x1b[0m%s\x1b[0m', '⬆️  SEND:', JSON.stringify(context))
    } catch (e) {
      if ((e.status !== 200 || e.retcode !== 100) && this.logLevel <= 1) console.log('\x1b[31m%s\x1b[31m\x1b[0m%s\x1b[0m', '🤔  SEND EXCEPTION:', JSON.stringify(e))
    }
    return mid
  }

  /**
   * 接收私聊消息
   * @param {String} uid QQ号
   * @param {String} uname QQ昵称
   * @param {String} msg 消息内容（未转CQ码）
   */
  async rcvMsg(uid, uname, msg) {
    return null
  }

  /**
   * 发送群消息
   * @param {String} id 群号
   * @param {String} message 消息内容
   * @return {String} 发送消息ID
   */
  async sendGroupMsg(id, message) {

    if (!message) return

    var context = { group_id: id, message }
    var mid = null
    try {
      mid = await this.bot('send_msg', context)
      if (logLevel <= 0) console.log('\x1b[32m%s\x1b[32m\x1b[0m%s\x1b[0m', '⬆️  SEND(GROUP):', JSON.stringify(context))
    } catch (e) {
      if ((e.status !== 200 || e.retcode !== 100) && this.logLevel <= 1) console.log('\x1b[31m%s\x1b[31m\x1b[0m%s\x1b[0m', '🤔  SEND(GROUP) EXCEPTION:', JSON.stringify(e))
    }
    return mid
  }

  /**
   * 接收群消息
   * @param {*} gid 群号
   * @param {*} uid 发送方QQ号
   * @param {*} uname 发送方QQ昵称
   * @param {*} msg 消息内容
   */
  async rcvGroupMsg(gid, uid, uname, msg) {
    return null
  }

}

module.exports = QQ