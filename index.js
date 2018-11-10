const config = require("./Configuration/config.js");

const app = require("express")();
const server = require("http").createServer(app);
const ejs = require("ejs");

const { readdir } = require("fs-nextra");

const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

const winston = global.winston = createLogger({
	transports: [
		new transports.Console({
			colorize: true,
		}),
		new DailyRotateFile({
			filename: "./Logs/Winston-Log-%DATE%.log",
			datePattern: "YYY-MM-DD-HH",
			zippedArchive: true,
			maxFiles: "14d",
			maxSize: "20m",
		}),
	],
	exitOnError: false,
	format: format.combine(
		format.colorize(),
		format.timestamp(),
		format.simple(),
	),
});

server.listen(config.webServer.port, config.webServer.ip, () => {
	winston.info(`[Web Server]: Running on ${config.webServer.ip}:${config.webServer.port}/`);
});

app.use(require("express").static(`${__dirname}/Views/Static/`));
app.use(require("body-parser").json());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(require("compression")());
app.set("views", `${__dirname}/Views/Pages`);
app.engine("ejs", ejs.renderFile);

(async() => {
	const getRoutes = await readdir("./Routes/GET");
	for (let i of getRoutes) {
		let route = require(`./Routes/GET/${i}`);
		let name = route.route.route;
		app.get(name, (req, res) => route(req, res));
	}
})();
