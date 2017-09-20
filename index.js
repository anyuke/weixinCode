function weixinCode(req, res, next) {
    if (!utils.isStrNotEmpty(req.method == 'GET' ? req.query.code : req.body.code)) {
        return utils.response(res, message.PARAMS_MISSING);
    }
    var code = req.method == 'GET' ? req.query.code : req.body.code;
    var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + config.third.weixin.appId + '&secret=' + config.third.weixin.appSecret + '&code=' + code + '&grant_type=authorization_code';
    request.get(url, function(err, rsp, body) {
        if (err) {
            logger.error(err);
            return utils.response(res, message.SYSTEM_ERROR);
        }
        try {
            req.args = {
                openid: JSON.parse(body).openid,
                unionid: JSON.parse(body).unionid
            };
            next();
            mysqlUtil.execute('SELECT tb_user.id userId,tb_user_mch_openid.userId exist FROM tb_user LEFT JOIN tb_user_mch_openid ON tb_user_mch_openid.userId = tb_user.id WHERE tb_user.unionid = ?', [JSON.parse(body).unionid], function(err, results) {
                if (err) {
                    logger.error(err);
                    return;
                }
                if (!results || results.length == 0) {
                    return;
                }
                if (results[0].exist) {
                    return;
                }
                mysqlUtil.execute('INSERT INTO tb_user_mch_openid SET ?', [{userId: results[0].userId, appid: config.third.weixin.appId, mchid: config.third.weixin.mchId, openid: JSON.parse(body).openid, unionid: JSON.parse(body).unionid, createTime: new Date().getTime()}]);
            });
        }
        catch (err) {
            logger.error(err);
            return utils.response(res, message.SYSTEM_ERROR);
        }
    });
}