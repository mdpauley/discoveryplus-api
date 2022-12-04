const chrome = require("chrome-cookies-secure");
const DiscoveryPlus = require("../index.js");
const _ = require("lodash");
const zeroPad = require("zero-pad");

(async () => {
  const dplus = new DiscoveryPlus({
    cookies: await chrome.getCookiesPromised(
      "https://us1-prod-direct.discoveryplus.com",
      "header"
    ),
  });

  // Using the previous search for `Street Outlaws`
  // 678 - Street Outlaws : street-outlaws : 1,2,3,4,5,6,7,8,9,10,11,12,13,14 : After tossing the top 10 list, the 405 competes in a high-stakes qualifier.
  episodes = await dplus.episodesBySeason(678, 1);

  _.each(episodes, async (episode) => {
    console.info(
      `${episode.attributes.name} (id:${episode.id})- S${zeroPad(
        episode.attributes.seasonNumber
      )}E${zeroPad(episode.attributes.episodeNumber)} - ${
        episode.attributes.description
      } (${episode.attributes.videoDuration} ms)`
    );
    console.info(
      `    link: https://www.discoveryplus.com/video/${episode.attributes.path}`
    );
  });
})();
