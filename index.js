const QQ = require('./QQ')
const GitHub = require('./GitHub')
const config = require('./config')


let links = {
    shouca: '[CQ:share,url=https://github.com/shou-ca,title=上海海洋大学计算机协会,content=欢迎任何有兴趣的同学加入~,image=https://avatars2.githubusercontent.com/u/54660224]',
    ryubai: '[CQ:share,url=https://ryubai.com/,title=留白的小站,content=这儿什么都没有！,image=https://avatars3.githubusercontent.com/u/16871361?s=460&v=4]',
    mowa: '[CQ:share,url=https://mowa.com/,title=上海魔蛙信息科技有限公司,content=什么都没有~,image=]',
}

let commands = () => [

]

let github = new GitHub(config.github.auth)
let qq = new QQ(config.cq.send, config.cq.rcv, config.cq.admin, 0)

qq.rcvMsg = async (uid, uname, msg) => {

    //if (uid === config.cq.admin.qq) return
    let d = qq.str.getDice(msg)
    console.log(d)
    if(d)return qq.str.dice(6)
    //return await github.GitHubUserAnalyse(msg)
}

qq.rcvGroupMsg = async (gid, uid, uname, msg) => {

    //if (gid === config.cq.admin.group) return
    
    /*
    var img_list = qq.str.getImage(msg)
    if (img_list.length > 0) {
        console.log(img_list)
        return qq.str.image('test.jpg')
    }*/
}

qq.log('(｡･∀･)ﾉﾞ嗨，Nyanbot已上线！😉 ')

