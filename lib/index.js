/**
 * Created by hfcj3 on 2017/7/10.
 */
'use strict';
// let login = require('./login');
// let file = require('./file');
// let cors = require('./cors');
// let match = require('./match');
module.exports = {
	...require('./login'),
	...require('./file'),
	...require('./cors'),
	...require('./match'),
	...require('./cache')
};
