# weixinCode
根据code获取用户信息

入口：
https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3531d95fd4dc1893&redirect_uri=http://member.5292game.com/html/contest.html?id=11&response_type=code&scope=snsapi_base#wechat_redirect

获取：
modules.common.weixinCode

结果：
req.args.unionid req.args.openid