/**
 * Created by hfcj3 on 2017/7/10.
 */
'use strict';
module.exports.matchHTML = html =>{
	html = html || '';
	return html.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi,'').trim();//去除html标签
};