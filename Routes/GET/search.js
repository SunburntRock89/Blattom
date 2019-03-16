const config = require("../../Configuration/config.js");
const { get } = require("chainfetch");

module.exports = async(req, res) => {
	if (req.query.q == "") return res.redirect("/");

	let result = await get(`https://api.cognitive.microsoft.com/bing/v7.0/search?q=${encodeURIComponent(req.query.q)}&cc=GB&mkt=en-GB`)
		.set("Ocp-Apim-Subscription-Key", config.bingKey)
		.set("Accept-Language", "en-GB");

	let resultsToSend = result.body.webPages.value;

	res.render("search.ejs", {
		matches: result.body.webPages.totalEstimatedMatches,
		results: resultsToSend,
		query: result.body.queryContext.originalQuery,
	});
};

module.exports.route = {
	route: "/search",
};
