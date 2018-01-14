const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body')();
const http = require('http');
const cors = require('kcors');
const randomString = require("randomstring");
const validator = require("validator");
const pgp = require('pg-promise')({
    // Initialization Options
});

const app = new Koa();
const router = new Router();

app.use(cors());
app.use(router.routes());
app.use(router.allowedMethods());

const dbConnectionString = 'postgres://ezsghdep:sxwpbHDXlBA0z_kmvkNnzgWKkzm4-mFQ@baasu.db.elephantsql.com:5432/ezsghdep';
const serverPort = 4555;

var db = pgp(dbConnectionString); // database instance;

/*
 *
 * User shortern a Url
 *
 */
router.post('/shortenUrl', koaBody, async function (ctx, next) {

	const url = ctx.request.body.url || null;

	const ip = ctx.request.body.ip || null;

	const platform = ctx.request.body.platform || null;

	console.log(`url = ${url}, ip = ${ip}, platform = ${platform}`);

	if(!url || !validator.isURL(url)) {

		ctx.status = 400;

		ctx.body = 'Please enter a valid URL';

		return;

	}

	try {

		const urlId = randomString.generate(6);

		await db.none('INSERT INTO urls(id, url, date_created, ip, platform) VALUES($1, $2, $3, $4, $5)', [urlId, url, new Date(), ip, platform]);

		const count = await db.one('SELECT COUNT(url) FROM urls WHERE url=$1', [url], c => +c.count);

		ctx.body = {url: `http://localhost:8080/#/${urlId}`, shorternCount: count};

	} catch(e) {

		ctx.status = 400;

		console.dir(e);

		ctx.body = e;

	}

});

/*
 *
 * User retrieve original Url
 *
 */
router.post('/getOriginalUrl', koaBody, async function (ctx, next) {

	let urlCode = ctx.request.body.urlCode || null;

	if(!urlCode) {

		ctx.status = 400;

		ctx.body = 'Invalid url code';

		return;

	}

	console.log(`urlCode = ${urlCode}`);

	try {

		let obj = await db.one('SELECT url FROM urls WHERE id = $1', [urlCode]);

		ctx.body = obj.url;

	} catch(e) {

		ctx.status = 400;

		ctx.body = 'Unable to find original Url :P';

	}

});

http.createServer(app.callback()).listen(serverPort);

console.log(`Server running on port ${serverPort}`);

