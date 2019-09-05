const QQ = require('./QQ')
const GitHub = require('./GitHub')
const config = require('./config')

var links = {
    shouca:'[CQ:share,url=https://github.com/shou-ca,title=上海海洋大学计算机协会,content=欢迎任何有兴趣的同学加入~,image=https://avatars2.githubusercontent.com/u/54660224]',
    
}

let qq = new QQ (

    rcvAdminMsg = async msg => {
        return await GitHubUserAnalyse(config.github.auth,msg)
    },

    rcvAdminGroupMsg = async (uid,name,msg) => {
        var img_list = qq.str.getImageURL(msg)
        if(img_list.length > 0){
            console.log(img_list)
            return qq.str.image('test.jpg')
        }
    },

    rcvMsg = async (uid,name,msg) => {
    },

    rcvGroupMsg = async (gid,uid,name,msg) => {
    },

    logLevel = 0,
)

//qq.log('(｡･∀･)ﾉﾞ嗨，Nyanbot已上线！😉 ')

GitHubInvite = async (auth,username,orgname) =>{

    let github = new GitHub(auth)
    let org = github.getOrganization(orgname)
    let rtn = (await org.inviteMember(username)).data
    return rtn
}

GitHubOrgAnalyse = async (auth,orgname) => {

    let github = new GitHub(auth)
    let org = github.getOrganization(orgname)
    let member = (await org.listMembers()).data

    let rtn = orgname + '的GitHub分析报告:'
    for(let i=0; i<member.length; i++){
        rtn += await GitHubUserAnalyse(member[i].login)
    }
    rtn += '用户数共计：'+member.length
    
    return rtn
}

GitHubUserAnalyse = async (auth,username) => {

    let github = new GitHub(auth)
    let user = github.getUser(username)
    let repos = (await user.listRepos()).data
    let rtn = username+'的GitHub分析报告:\n'
    if(repos.length > 0)for(let i=0; i<repos.length; i++){
        rtn += repos[i].name + ' Star数:' + repos[i].stargazers_count + ' Fork数:' + repos[i].forks + ' Fork他人:'+repos[i].fork + '\n'
    }
    rtn += 'Repo数共计：'+repos.length
    
    return rtn
}

