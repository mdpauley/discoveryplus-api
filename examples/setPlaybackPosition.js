const chrome = require("chrome-cookies-secure");
const DiscoveryPlus = require("../index.js");

(async () => {
  const dplus = new DiscoveryPlus({
    cookies: await chrome.getCookiesPromised(
      "https://us1-prod-direct.discoveryplus.com",
      "header"
    ),
  });

  // Using the previous search for `Street Outlaws`
  // 678 - Street Outlaws : street-outlaws : 1,2,3,4,5,6,7,8,9,10,11,12,13,14 : After tossing the top 10 list, the 405 competes in a high-stakes qualifier.
  // Midnight Riders (id:1089401)- S01E01 - Oklahoma City's fastest street racers compete for spots on a top ten list. (2557388 ms)
    // link: https://www.discoveryplus.com/video/street-outlaws/midnight-riders

  const setPlayback = await dplus.setPlaybackPosition(1089401, 757388);

  // { meta: { message: 'report received' } } 
  console.log(setPlayback)
})();
