const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body')();
const http = require('http');
const cors = require('kcors');

const app = new Koa();
const router = new Router();

app.use(cors());
app.use(router.routes());
app.use(router.allowedMethods());

const serverPort = 4555;
const maximumButtonValue = 100, minimumButtonValue = -100;
const maximumProgressBarValue = 1000, minimumProgressBarValue = 100;

/*
 *
 * get progress bar init value
 *
 */
router.get('/getInitProgressBarValue', koaBody, async function (ctx, next) {

	const data = {
	  	"buttons": [
	        Math.floor(Math.random() * (maximumButtonValue - minimumButtonValue + 1)) + minimumButtonValue,
	        Math.floor(Math.random() * (maximumButtonValue - minimumButtonValue + 1)) + minimumButtonValue,
	        Math.floor(Math.random() * (maximumButtonValue - minimumButtonValue + 1)) + minimumButtonValue,
	        Math.floor(Math.random() * (maximumButtonValue - minimumButtonValue + 1)) + minimumButtonValue
	    ],
	    "bars": [
	        Math.floor(Math.random() * (maximumProgressBarValue - minimumProgressBarValue + 1)) + minimumProgressBarValue,
	        Math.floor(Math.random() * (maximumProgressBarValue - minimumProgressBarValue + 1)) + minimumProgressBarValue,
	        Math.floor(Math.random() * (maximumProgressBarValue - minimumProgressBarValue + 1)) + minimumProgressBarValue
	    ],
	    "limit": Math.floor(Math.random() * (maximumProgressBarValue - minimumProgressBarValue + 1)) + minimumProgressBarValue
	};

	ctx.body = data;

});

http.createServer(app.callback()).listen(serverPort);

console.log(`Server running on port ${serverPort}`);

