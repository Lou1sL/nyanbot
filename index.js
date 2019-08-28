let qq = new (require('./qq'))(

    rcvAdminMsg      = msg                => { return msg },
    rcvAdminGroupMsg = (uid,name,msg)     => { return `id:${uid} name:${name} said:${msg}` },
    rcvMsg           = (uid,name,msg)     => { return `id:${uid} name:${name} said:${msg}` },
    rcvGroupMsg      = (gid,uid,name,msg) => { console.log(`gid:${gid} uid:${uid} name:${name} said:${msg}`) }
)

qq.log('Hello,Nyanbot!')