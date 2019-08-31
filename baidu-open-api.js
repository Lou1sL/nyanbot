const config = require('./config')
const request = require("request-promise")
const urlencode = require('urlencode')
const fs = require('fs')



const getAccessToken = () => {
    const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${config.baidu_ak}&client_secret=${config.baidu_sk}`;
    var token = null
    request.get(url, function(error, response, body){
        if(!error && response.statusCode == 200) token = (JSON.parse(body))['access_token']
    })
    return token
}
const imageB2W = (token,url) => {

    var img = request.get(url)

    var i = urlencode(img.toString('base64'))

    var o = null
    request.post(
        { url:`https://aip.baidubce.com/rest/2.0/image-process/v1/colourize?access_token=${token}`, form: { image:i } }, 
        function (error, response, body) {
            if (!error && response.statusCode == 200)  o = (JSON.parse(body))['image']
            console.log(body)
        }
    )
    var filename = `${Math.random().toString()}.png`
    fs.writeFile(filename, o, 'base64', function(err) { console.log(err) })
    return filename
}



module.exports = { getAccessToken,imageB2W }