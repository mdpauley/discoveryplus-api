const fetch = require("node-fetch");
const _ = require("lodash");

class DiscoveryPlus {
  constructor(opt) {
    this.baseUrl = opt.baseUrl || "https://us1-prod-direct.discoveryplus.com";
    this.cookies = opt.cookies || "";
    this.fetchOpts = {
      headers: {
        accept: "application/json, text/plain, */*",
        "X-Disco-client": "WEB:UNKNOWN:dplus_us:2.7.1",
        "X-disco-params":
          "realm=go,bid=dplus,hn=www.discoveryplus.com,hth=,features=ar",
        cookie: this.cookies,
        referrer: "https://www.discoveryplus.com/",
        referrerPolicy: "strict-origin-when-cross-origin",
      },
      method: "GET",
    };
  }

  search = async (query) => {
    const url = `${
      this.baseUrl
    }/cms/routes/search/result?include=default&decorators=none&contentFilter[query]=${encodeURI(
      query
    )}&page[items.number]=1&page[items.size]=8`;

    const res = await fetch(url, this.fetchOpts);

    return await res.json();
  };

  showDetails = async (alternateId) => {
    const url = `${this.baseUrl}/cms/routes/show/${alternateId}?include=default&decorators=viewingHistory,isFavorite,playbackAllowed`;
    const res = await fetch(url, this.fetchOpts);

    return await res.json();
  };

  showSeasonInfo = async (showId, seasonNumber) => {
    const url = `${this.baseUrl}/content/videos/?filter[seasonNumber]=${seasonNumber}&filter[show.id]=${showId}&filter[videoType]=EPISODE&include=primaryChannel%2Cshow%2Cimages%2Cseason&page[number]=1&page[size]=100`;
    const res = await fetch(url, this.fetchOpts);

    return await res.json();
  };

  episodesBySeason = async (showId, seasonNumber) => {
    const season = await this.showSeasonInfo(showId, seasonNumber);

    const sortedEpisodes = _.chain(season.data)
      .sortBy("attributes.episodeNumber")
      .filter({ attributes: { videoType: "EPISODE" } })
      .value();

    return sortedEpisodes;
  };

  setPlaybackPosition = async (videoId, position) => {
    const url = `${this.baseUrl}/playback/v2/report/video/${videoId}?position=${position}`;
    const res = await fetch(url, {
      ...this.fetchOpts,
      method: "PUT",
      body: null,
    });

    return await res.json();
  };
}

module.exports = DiscoveryPlus;
