const EdgeAuth = require('akamai-edgeauth')
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

exports.handler = (event, context) => {
    
    let duration = 10800;
    let ffa_key = process.env.FFA_KEY || ''
    let nrl_key = process.env.NRL_KEY || ''
    let afl_key = process.env.AFL_KEY || ''
    let netball_key = process.env.NETBALL_KEY || ''
    let bucketName = process.env.BUCKET || ''
    let path = process.env.S3PATH || ''

    var output = [
        {
            key: key1,
            acl: '',
            file: 'file1'
        },
        {
            key: key1,
            acl: '',
            file: 'file2'
        },
        {
            key: key1,
            acl: '',
            file: 'file3'
        },
        {
            key: key1,
            acl: '',
            file: 'file4'
        }
    ]

    asyncForEach(output , async (val) => {
        var ea = new EdgeAuth({
            key: val.key,
            windowSeconds: duration,
            escapeEarly: true,
            tokenName: "hdnts",
            verbose: false
        })
        let token = ea.generateACLToken(val.acl)
        var params = { Bucket: bucketName, Key: `${path}/${val.file}`, Body: token };
        putItem(params);
      })



}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

const putItem = async (params) => {
    return new Promise((resolve,reject) =>{
         s3.putObject(params, function (err, data) {
            if (err) {
                reject(err)
            }
            else {
                console.log(data)
                resolve(data)
            }
        });
    })
}
