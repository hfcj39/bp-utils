/**
 * Created by hfcj3 on 2017/7/10.
 */
'use strict';
const crypto = require('crypto');
const moment = require('moment');

/**
 * creat token
 */
module.exports.creatToken = function(name) {
	let period = moment().add(1,'days').unix();
	let payload = {
		sub:name,
		iat:moment().unix(),
		exp:period
	};
	let secret = 'ZnVja3NoaXQ=';
	return jwt_encode(payload,secret)
};

/**
 * check token
 */
module.exports.ensureAuthenticated = function(ctx,next) {
	//console.log(ctx.request.header['authorization'])
	if(!ctx.request.header['authorization']){
		ctx.response.status=401;
		ctx.body={err:"缺少auth头，请重新登录"};
		return
	}
	let temp_token = ctx.request.header['authorization'];
	let token = temp_token.split(' ')[1];
	//console.log(token);
	let secret = 'ZnVja3NoaXQ=';
	let payload = null;
	try{
		payload = jwt_decode(token,secret)
	}catch(err){
		ctx.response.status=401;
		ctx.body = {err:"Token有误，请重新登录"};
		return
	}
	if(payload.exp <= moment().unix()){
		ctx.response.status=401;
		ctx.body={err:"Token超时，请重新登录"};
		return
	}
	ctx.username = payload.sub;
	//console.log(ctx.username);
	return next()
};

/**
 * support algorithm mapping
 */
let algorithmMap = {
	HS256: 'sha256',
	HS384: 'sha384',
	HS512: 'sha512',
	RS256: 'RSA-SHA256'
};

/**
 * Map algorithm to hmac or sign type, to determine which crypto function to use
 */
let typeMap = {
	HS256: 'hmac',
	HS384: 'hmac',
	HS512: 'hmac',
	RS256: 'sign'
};
/**
 * encode func
 */
function jwt_encode(payload, key, algorithm, options) {
	// Check key
	if (!key) {
		throw new Error('Require key');
	}

	// Check algorithm, default is HS256
	if (!algorithm) {
		algorithm = 'HS256';
	}

	let signingMethod = algorithmMap[algorithm];
	let signingType = typeMap[algorithm];
	if (!signingMethod || !signingType) {
		throw new Error('Algorithm not supported');
	}

	// header, typ is fixed value.
	const header = {typ: 'JWT', alg: algorithm};
	if (options && options.header) {
		assignProperties(header, options.header);
	}

	// create segments, all segments should be base64 string
	let segments = [];
	segments.push(base64urlEncode(JSON.stringify(header)));
	segments.push(base64urlEncode(JSON.stringify(payload)));
	segments.push(sign(segments.join('.'), key, signingMethod, signingType));

	return segments.join('.');
}

/**
 * decode func
 */
function jwt_decode(token, key, noVerify, algorithm) {
	// check token
	if (!token) {
		throw new Error('No token supplied');
	}
	// check segments
	let segments = token.split('.');
	if (segments.length !== 3) {
		throw new Error('Not enough or too many segments');
	}

	// All segment should be base64
	let headerSeg = segments[0];
	let payloadSeg = segments[1];
	let signatureSeg = segments[2];

	// base64 decode and parse JSON
	let header = JSON.parse(base64urlDecode(headerSeg));
	let payload = JSON.parse(base64urlDecode(payloadSeg));

	if (!noVerify) {
		let signingMethod = algorithmMap[algorithm || header.alg];
		let signingType = typeMap[algorithm || header.alg];
		if (!signingMethod || !signingType) {
			throw new Error('Algorithm not supported');
		}

		// verify signature. `sign` will return base64 string.
		let signingInput = [headerSeg, payloadSeg].join('.');
		if (!verify(signingInput, key, signingMethod, signingType, signatureSeg)) {
			throw new Error('Signature verification failed');
		}

		// Support for nbf and exp claims.
		// According to the RFC, they should be in seconds.
		if (payload.nbf && Date.now() < payload.nbf*1000) {
			throw new Error('Token not yet active');
		}

		if (payload.exp && Date.now() > payload.exp*1000) {
			throw new Error('Token expired');
		}
	}

	return payload;
}

/**
 * private util functions
 */

function assignProperties(dest, source) {
	for (let attr in source) {
		if (source.hasOwnProperty(attr)) {
			dest[attr] = source[attr];
		}
	}
}

function verify(input, key, method, type, signature) {
	if(type === "hmac") {
		return (signature === sign(input, key, method, type));
	}
	else if(type === "sign") {
		return crypto.createVerify(method)
			.update(input)
			.verify(key, base64urlUnescape(signature), 'base64');
	}
	else {
		throw new Error('Algorithm type not recognized');
	}
}

function sign(input, key, method, type) {
	let base64str;
	if(type === "hmac") {
		base64str = crypto.createHmac(method, key).update(input).digest('base64');
	}
	else if(type === "sign") {
		base64str = crypto.createSign(method).update(input).sign(key, 'base64');
	}
	else {
		throw new Error('Algorithm type not recognized');
	}

	return base64urlEscape(base64str);
}

function base64urlDecode(str) {
	return new Buffer(base64urlUnescape(str), 'base64').toString();
}

function base64urlUnescape(str) {
	str += new Array(5 - str.length % 4).join('=');
	return str.replace(/\-/g, '+').replace(/_/g, '/');
}

function base64urlEncode(str) {
	return base64urlEscape(new Buffer(str).toString('base64'));
}

function base64urlEscape(str) {
	return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
