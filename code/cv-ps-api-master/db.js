// DEPENDENCIES
const Pool = require('pg').Pool;

// CONSTANTS
const dbString = process.env.DATABASE_URL || "unknown";

// SETUP
const pool = new Pool({
  connectionString: dbString
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
});

// HELPER
function _doSQL(str, params) {
  var client;
  return pool.connect()
    .then(c => {
      client = c;
      if (params)
        return client.query(str, params);
      return client.query(str);
    }).then(res => {
      client.release()
      return res.rows;
    }).catch(e => {
      console.error(JSON.stringify(e, null, 2));
      client.release()
      return Promise.reject(e);
    })
}

function _makeFieldsString(o) {
  function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
  }
  var obj = clone(o);
  for (var key in obj) {
    obj[key] += "";
  }
  return obj;
}

function _getIntId() {
  return Math.floor(Math.random() * (100000 - 1 + 1)) + 1;
}

// GET ALL
function getPedestrians() {
  return _doSQL("SELECT * FROM public.pedestrians");
}

function getVehicles() {
  return _doSQL("SELECT * FROM public.vehicles");
}

function getPins() {
  return _doSQL("SELECT * FROM public.pins");
}

function getSensors() {
  return _doSQL("SELECT * FROM public.sensors");
}

function getBusinesses() {
  return _doSQL("SELECT * FROM public.businesses");
}

// GET BY ID
function getPedestrian(id) {
  return _doSQL("SELECT * FROM public.pedestrians WHERE locationuid = $1", [id]);
}

function getVehicle(id) {
  return _doSQL("SELECT * FROM public.vehicles WHERE locationuid = $1", [id]);
}

function getPin(id) {
  return _doSQL("SELECT * FROM public.pins WHERE pinid = $1", [id]);
}

function getSensor(id) {
  return _doSQL("SELECT * FROM public.sensors WHERE locationuid = $1", [id]);
}

function getBusiness(id) {
  return _doSQL("SELECT * FROM public.businesses WHERE bid = $1", [id]);
}

// SET
function createPedestrian(ped) {
  ped = _makeFieldsString(ped);
  return _doSQL(
    'INSERT INTO public.pedestrians(locationuid, lat, long, pcount, speed, direction, timestamp, result, date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING locationuid', [
      ped.locationuid, ped.lat, ped.long, ped.pcount, ped.speed, ped.direction,
      ped.timestamp, ped.result, ped.date
    ]
  );
}

function createVehicle(v) {
  v = _makeFieldsString(v);
  return _doSQL(
    'INSERT INTO public.vehicles(locationuid, lat, long, vcount, speed, direction, timestamp, result, date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING locationuid', [
      v.locationuid, v.lat, v.long, v.vcount, v.speed, v.direction,
      v.timestamp, v.result, v.date
    ]
  );
}

function createPin(pin) {
  pin = _makeFieldsString(pin);
  return _doSQL(
    'INSERT INTO public.pins(pinid, bid, name, lat, long) VALUES($1, $2, $3, $4, $5) RETURNING pinid', [
      _getIntId(), 1, pin.name, pin.lat, pin.long
    ]
  );
}

function createSensor(sensor) {
  sensor = _makeFieldsString(sensor);
  return _doSQL(
    'INSERT INTO public.sensors(locationuid, lat, long) VALUES($1, $2, $3) RETURNING locationuid', [
      sensor.locationuid, sensor.lat, sensor.long
    ]
  );
}

// DELETE ALL
function clearPedestrians() {
  return _doSQL('DELETE FROM public.pedestrians');
}

function clearVehicles() {
  return _doSQL('DELETE FROM public.vehicles');
}

function clearPins() {
  return _doSQL('DELETE FROM public.pins');
}

function clearSensors() {
  return _doSQL('DELETE FROM public.sensors');
}

// EXPORTS
module.exports.getPedestrians = getPedestrians;
module.exports.getVehicles = getVehicles;
module.exports.getPins = getPins;
module.exports.getSenors = getSensors;
module.exports.getBusinesses = getBusinesses;
module.exports.getPedestrian = getPedestrian;
module.exports.getVehicle = getVehicle;
module.exports.getPin = getPin;
module.exports.getSensor = getSensor;
module.exports.createPin = createPin;
module.exports.createPedestrian = createPedestrian;
module.exports.createVehicle = createVehicle;
module.exports.createSensor = createSensor;
module.exports.clearPedestrians = clearPedestrians;
module.exports.clearVehicles = clearVehicles;
module.exports.clearPins = clearPins;
module.exports.clearSensors = clearSensors;
