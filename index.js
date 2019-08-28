let qq = new (require('./qq'))(

    rcvAdminMsg      = msg                => { return msg },
    rcvAdminGroupMsg = (uid,name,msg)     => { return msg },
    rcvMsg           = (uid,name,msg)     => { return msg },
    rcvGroupMsg      = (gid,uid,name,msg) => { console.log(`gid:${gid} uid:${uid} name:${name} said:${msg}`) }
)

qq.log('Hello,Nyanbot!')