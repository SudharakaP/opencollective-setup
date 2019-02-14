import chalk from 'chalk';
const utils = require('../lib/utils');
const debug = utils.debug;
const fetch = require('node-fetch');

const fetchStats = function(collectiveUrl) {
  const url = `${collectiveUrl}.json`;
  return fetch(url, { timeout: 1500 })
  .then((res) => {
    return res.json();
  })
  .then((json) => {
    return {
      currency: json.currency,
      balance: json.balance,
      yearlyIncome: json.yearlyIncome,
      backersCount: json.backersCount,
      contributorsCount: json.contributorsCount,
    };
  })
  .catch((e) => {
    const collectiveSlug = collectiveUrl.substr(collectiveUrl.lastIndexOf('/')+1);
    console.error(`${chalk.red('[server error]')} Cannot load the stats for ${collectiveSlug} – please try again later`);
    debug('Error while fetching ', url);
  });
};

const fetchBanner = function(slug) {
  const url = `https://opencollective.com/${slug}/banner.md`;
  return fetch(url)
    .then((res) => {
      return res.text();
    })
    .catch((e) => {
      debug('Error while fetching ', url);
    });
};

const fetchLogo = function(logoUrl) {
  if (!logoUrl.match(/^https?:\/\//)) {
    return '';
  }
  return fetch(logoUrl, { timeout: 1500 })
    .then((res) => {
      if (res.status === 200 && res.headers.get('content-type').match(/^text\/plain/)) return res.text();
      else return '';
    })
    .catch((e) => {
      debug('Error while fetching ', logoUrl);
    });
};

module.exports = {
  fetchLogo, fetchStats, fetchBanner,
};
