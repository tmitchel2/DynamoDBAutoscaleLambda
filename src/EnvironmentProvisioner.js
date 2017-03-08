import DefaultProvisioner from './configuration/DefaultProvisioner';

/*
 * Go through the given JSON object and replace values using environment
 * variables if available. The environment variables follow the scheme of
 * the names in the JSON. For instance, the following JSON scheme will be
 * populated with the environment variables whose names are the given values:
 *
 * {
 *   "ReadCapacity": {
 *     "Min": READCAPACITY_MIN,
 *     "Max": READCAPACITY_MAX,
 *     "Increment": {
 *       "When": {
 *         "UtilisationIsAbovePercent": READCAPACITY_INCREMENT_WHEN_UTILISATIONISABOVEPERCENT,
 *         "ThrottledEventsPerMinuteIsAbove": READCAPACITY_INCREMENT_WHEN_THROTTLEDEVENTSPERMINUTEISABOVE
 *       },
 *     }
 *  }
 */
function populateJson(json, prefixEnv=false, list_available=false) {
  var ret = {}

  if (prefixEnv) {
    prefixEnv = prefixEnv + '_'
  } else {
    prefixEnv = ''
  }

  for (var key in json) {
    env = (prefixEnv + key).toUpperCase()
    if (typeof json[key] == 'object') {
      if (list_available) {
        Object.assign(ret, populateJson(json[key], env, list_available));
      } else {
        ret[key] = populateJson(json[key], env, list_available)
      }
    } else {
      if (list_available) {
        ret[env] = json[key]
      } else {
        if (typeof process.env[env] === 'undefined'
              || isNaN(process.env[env]) != isNaN(json[key])) {
          ret[key] = json[key]
        } else if (isNaN(process.env[env])) {
          ret[key] = process.env[env]
        } else {
          ret[key] = Number(process.env[env])
        }
      }
    }
  }

  return ret
}

if (typeof process.env['ENVIRONMENTPROVISIONER_LIST_AVAILABLE'] !== 'undefined' &&
      process.env['ENVIRONMENTPROVISIONER_LIST_AVAILABLE'] == 'true') {
    console.log('%j', populateJson(DefaultProvisioner, false, true))
    process.exit(0)
}

/*
 * Use the DefaultProvisioner as basis for the EnvironmentProvisioner
 */
module.exports = populateJson(DefaultProvisioner)
