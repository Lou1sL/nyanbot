const QQ = require('./QQ')
const GitHub = require('./GitHub')


let github = new GitHub()
let shouca = github.getOrganization('shou-ca')
shouca.listMembers({},(err, res, req)=>{console.log(req)})


var links = {
    shouca:'[CQ:share,url=https://github.com/shou-ca,title=上海海洋大学计算机协会,content=欢迎任何有兴趣的同学加入~,image=https://avatars2.githubusercontent.com/u/54660224]',
    
}




let qq = new QQ (
    rcvAdminMsg = msg => {

    },
    rcvAdminGroupMsg = (uid,name,msg) => {

        var img_list = qq.str.getImageURL(msg)

        if(img_list.length > 0){

            console.log(img_list)
            return qq.str.image('test.jpg')
        }

    },
    rcvMsg = (uid,name,msg) => {

    },
    rcvGroupMsg = (gid,uid,name,msg) => {

    },

    logLevel = 0,
)
qq.log('(｡･∀･)ﾉﾞ嗨，Nyanbot已上线！😉 ')

