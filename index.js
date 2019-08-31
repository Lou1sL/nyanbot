const QQ = require('./qq')
const { getAccessToken,imageB2W } = require('./baidu-open-api')



var links = {
    shouca:'[CQ:share,url=https://github.com/shou-ca,title=上海海洋大学计算机协会,content=欢迎任何有兴趣的同学加入~,image=https://avatars2.githubusercontent.com/u/54660224]',
    
}

let qq = new QQ (
    rcvAdminMsg = msg => {
        //return msg
    },
    rcvAdminGroupMsg = (uid,name,msg) => {

        var img_list = qq.fetchCQImages(msg)

        if(img_list.length > 0){
            var token = getAccessToken()
            var path = imageB2W(token,img_list[0])
            return qq.CQImage(path)
        }
        //return msg
    },
    rcvMsg = (uid,name,msg) => {
        //return msg
    },
    rcvGroupMsg = (gid,uid,name,msg) => {
        //console.log(`gid:${gid} uid:${uid} name:${name} said:${msg}`)
    },
    logLevel = 0,
)
//qq.log('(｡･∀･)ﾉﾞ嗨，Nyanbot已上线！😉 ')