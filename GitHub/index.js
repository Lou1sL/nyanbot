const gh = require('./GitHub')

/**
 * GitHub主类
 */
class GitHub {

    /**
     * 创建一个新的GitHub登录实例
     * @param {Requestable.auth} [auth] 登录用户名及密码
     */
    constructor(auth) { this.github = new gh(auth) }

    /**
     * 邀请一名用户到组织中
     * @param {String} username 邀请对象用户登录名
     * @param {String} orgname 邀请至组织（登录用户必须是组织owner）
     */
    async GitHubInvite(username, orgname) {
        let org = this.github.getOrganization(orgname)
        let rtn = (await org.inviteMember(username)).data
        return rtn
    }

    /**
     * 分析一个组织
     * @param {String} orgname 组织名
     */
    async GitHubOrgAnalyse(orgname) {
        let org = this.github.getOrganization(orgname)
        let member = (await org.listMembers()).data
        let rtn = orgname + ' 的GitHub分析报告:'
        for (let i = 0; i < member.length; i++)
            rtn += await this.GitHubUserAnalyse(member[i].login)
        rtn += '用户数共计：' + member.length
        return rtn
    }

    /**
     * 分析一名用户
     * @param {String} username 用户名
     */
    async GitHubUserAnalyse(username) {
        let user = this.github.getUser(username)
        let repos = (await user.listRepos()).data
        let rtn = username + ' 的GitHub分析报告:\n'
        if (repos.length > 0)
            for (let i = 0; i < repos.length; i++)
                rtn += repos[i].name + ': Star:' + repos[i].stargazers_count + ' Fork:' + repos[i].forks + (repos[i].fork ? '(Fork他人)' : '') + '\n'
        rtn += 'Repo数共计：' + repos.length
        return rtn
    }
}

module.exports = GitHub