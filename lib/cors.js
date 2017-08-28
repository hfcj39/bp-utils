/**
 * Created by hfcj3 on 2017/7/10.
 */
'use strict';
module.exports.cors = function (ctx, next) {
	//console.log(ctx.request.method);
	if(!ctx){
		throw new Error('!ctx');
	}
	ctx.set({
		"Access-Control-Allow-Origin":'*',
		'Access-Control-Allow-Credentials':'true',
		'Access-Control-Allow-Methods':'GET, POST, OPTIONS',
		'Access-Control-Allow-Headers':'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization',
		'Access-Control-Max-Age':'1728000'
	});
	if(ctx.request.method==='OPTIONS'){
		ctx.status=204;
	}
	return next();
};