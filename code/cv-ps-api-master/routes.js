// DEPENDENCIES
var router = require("express").Router();
var db = require("./db.js");

// HELPER
function _finish(res, p) {
  p.then(function(resp) {
    res.status(200).json(resp);
  }).catch(function(error) {
    res.status(500).json(error);
  });
}

// GET ALL
function getPedestrians(req, res) {
  _finish(res, db.getPedestrians());
}

function getVehicles(req, res) {
  _finish(res, db.getVehicles());
}

function getPins(req, res) {
  _finish(res, db.getPins());
}

function getSensors(req, res) {
  _finish(res, db.getSensors());
}

function getBusinesses(req, res) {
  _finish(res, db.getBusinesses());
}

// GET BY ID
function getPedestrian(req, res) {
  _finish(res, db.getPedestrian(req.params.id));
}

function getVehicle(req, res) {
  _finish(res, db.getVehicle(req.params.id));
}

function getPin(req, res) {
  _finish(res, db.getPin(req.params.id));
}

function getSensor(req, res) {
  _finish(res, db.getSensor(req.params.id));
}

function getBusiness(req, res) {
  _finish(res, db.getBusiness(req.params.id));
}

// SET
function createPedestrian(req, res) {
  _finish(res, db.createPedestrian(req.body));
}

function createVehicle(req, res) {
  _finish(res, db.createVehicle(req.body));
}

function createPin(req, res) {
  _finish(res, db.createPin(req.body));
}

function createSensor(req, res) {
  _finish(res, db.createSensor(req.body));
}

// DELETE
function clearPedestrians(req, res) {
  _finish(res, db.clearPedestrians())
}

function clearVehicles(req, res) {
  _finish(res, db.clearVehicles())
}

function clearPins(req, res) {
  _finish(res, db.clearPins())
}

function clearSensors(req, res) {
  _finish(res, db.clearSensors())
}

// EXPORTS
router.get("/pedestrians", getPedestrians);
router.get("/pedestrians/:id", getPedestrian);
router.post("/pedestrians", createPedestrian);
router.delete("/pedestrians", clearPedestrians);
router.get("/vehicles", getVehicles);
router.get("/vehicles/:id", getVehicle);
router.post("/vehicles", createVehicle);
router.delete("/vehicles", clearVehicles);
router.get("/pins", getPins);
router.get("/pins/:id", getPin);
router.post("/pins", createPin);
router.delete("/pins", clearPins);
router.get("/sensors", getSensors);
router.get("/sensors/:id", getSensor);
router.post("/sensors", createSensor);
router.delete("/sensors", clearSensors);
router.get("/businesses", getBusinesses);
router.get("/businesses/:id", getBusiness);
module.exports = router;
