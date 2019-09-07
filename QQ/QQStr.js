const fs = require('fs')
const config = require('../config')

/**
 * 特殊cq码字符串生成/提取（QQ类的静态子类）
 */
class QQStr {

  /**
   * 构造分享链接的特殊字符串
   * @param {String} url url链接
   * @param {String} title 标题
   * @param {String} content 简介（标题下方的小字）
   * @param {String} image 图片（URL）
   * @return {String}
   */
  share(url, title, content, image) {
    return `[CQ:share,url=${url},title=${title},content=${content},image=${image}]`
  }

  /**
   * 构造艾特某人的特殊字符串
   * @param {String} uid QQ号 
   * @return {String}
   */
  at(uid) {
    return `[CQ:at,qq=${uid}]`
  }

  /**
   * 构造艾特全体的特殊字符串
   * @return {String}
   */
  atAll() {
    return `[CQ:at,qq=all]`
  }

  /**
   * 获取QQ消息中的全部艾特
   * @param {String} message QQ消息原文
   * @return {Array<String>} QQ号构成的数组
   */
  getAt(message) {
    var regex = /\[CQ:at,qq=(.*?)\]/g
    var at_list = []
    var nxt = regex.exec(message)
    while (nxt) { at_list.push(nxt[1]); message.replace(nxt); nxt = regex.exec(message) }

    return at_list
  }

  dice(v){
    return `[CQ:dice,type=${v}]`
  }

  getDice(message){
    var regex = /\[CQ:dice,type=(.*?)\]/g
    var dice_list = []
    var nxt = regex.exec(message)
    while (nxt) { dice_list.push(nxt[1]); message.replace(nxt); nxt = regex.exec(message) }

    return dice_list[0]
  }

  /**
   * 构造发送图片的特殊字符串
   * @param {String,Array<String>} path 图片路径（可以是URL\本地路径的str、也可是由上者构成的str arr）
   * @return {String}
   */
  image(path) {
    var regex = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator
    var ret = ""
    if (Array.isArray(path)) {
      path.forEach((item, index, array) => {
        if (regex.test(item)) {
          var newname = Date.now()
          fs.copyFileSync(item, config.cq.img_path + newname)
          ret += `[CQ:image,file=${newname}]`
        } else {
          ret += `[CQ:image,url=${item}]`
        }
      }
      )
    } else {
      if (regex.test(path)) {
        var newname = Date.now()
        fs.copyFileSync(path, config.cq.img_path + newname)
        ret = `[CQ:image,file=${newname}]`
      } else {
        ret = `[CQ:image,url=${path}]`
      }
    }
    return ret
  }

  /**
   * 获取QQ消息中的全部图片
   * @param {String} message QQ消息原文
   * @return {Array<String>} url构成的数组
   */
  getImage(message) {
    var regex = /\[CQ:image,file=.*?,url=(.*?)\]/g
    var img_list = []
    var nxt = regex.exec(message)
    while (nxt) { img_list.push(nxt[1]); message.replace(nxt); nxt = regex.exec(message) }

    return img_list
  }
}

module.exports = QQStr