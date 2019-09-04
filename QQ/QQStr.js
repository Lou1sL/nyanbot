const fs     = require('fs')
const config = require('../config')

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

  module.exports = QQStr