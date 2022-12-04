const chrome = require("chrome-cookies-secure");
const DiscoveryPlus = require("../index.js");
const _ = require("lodash");

(async () => {
  const dplus = new DiscoveryPlus({
    cookies: await chrome.getCookiesPromised(
      "https://us1-prod-direct.discoveryplus.com",
      "header"
    ),
  });

  // search for `Street Outlaws`
  const shows = await dplus.search(`Street Outlaws`);

  // get the actual show id
  const filteredShows = _.filter(shows.included, {
    relationships: { show: { data: { type: "show" } } },
  });

  const searchResultShows = await _.chain(shows.included)
    .filter({ attributes: { alias: "search-result-shows" } })
    .map("relationships.items.data")
    .head()
    .map((obj) => {
      return _.assign(obj, _.find(filteredShows, { id: obj.id }));
    })
    .map((obj) => {
      return _.assign(
        obj,
        _.find(shows.included, {
          id: obj.relationships.show.data.id,
          type: "show",
        })
      );
    })
    .value();

  // get the actual show data!
  _.each(searchResultShows, async (s) => {
    console.info(
      `${s.id} - ${s.attributes.name} : ${s.attributes.alternateId} : ${s.attributes.seasonNumbers} : ${s.attributes.description}`
    );
  });
})();
