const request = require('request');
const people = require('./people');

function getNewName (cb) {
  request('https://randomuser.me/api/', (error, response, body) => {
    if (error) {
      return cb(error);
    }
    if (!error && response.statusCode === 200) {
      var name = JSON.parse(body).results[0].name;
      var firstName = capitalise(name.first);
      var lastName = capitalise(name.last);
      var fullName = `${firstName} ${lastName}`;
      return cb(null, fullName);
    }
  });
}

function getNewPlace (type, cb) {
  const person = people[type];
  if (person === undefined) {
    return cb({
      success: false,
      reason: 'invalid person type'
    });
  }
  const url = `https://nomadlist.com/api/v2/filter/city?c=2&f1_target=safety_level&f1_type=${person.safety}&f2_target=long_term_cost_in_usd&f2_type=${person.budget}`;
  request(url, (error, response, body) => {
    if (error) {
      return cb(error);
    }
    if (!error && response.statusCode === 200) {
      const cities = JSON.parse(body).slugs;
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      return cb(null, randomCity.split('-').map(word => capitalise(word)).join(' '));
    }
  });
}

function capitalise(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

module.exports = {
  getNewName: getNewName,
  getNewPlace: getNewPlace
};
