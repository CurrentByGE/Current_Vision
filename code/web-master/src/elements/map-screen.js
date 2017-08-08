Polymer({

	is: 'map-screen',

	properties: {
		circles: {
			type: Object,
			notify: true,
			value: []
		},
		pins: {
			type: Object,
			notify: true,
			value: [{
				name: "Zone 1",
				lat: 32.7157,
				long: -117.1611
			}]
		},
		pedestrians: {
			type: Object,
			notify: true,
			value: [{
				lat: 32.7166,
				long: -117.1540,
				pcount: 3
			}, {
				lat: 32.716277,
				long: -117.165891,
				pcount: 5
			}]
		}
	},

	toggleCircles: function(e) {
		if (e.target.checked) {
			this._addCircles();
		} else {
			this._removeCircles();
		}
	},

	refresh: function(e) {
		if (e)
			window.location.href = "/";
	},

	savePins: function(e) {
		if (e) {
			// window.location.href = "/";
		}
	},

	placePin: function(e) {
		if (e) {
			var name = "Zone " + (this.pins.length + 1);
			var pin = {
				lat: this.$.map.map.center.lat(),
				long: this.$.map.map.center.lng(),
				name: name
			};
			this.push('pins', pin);
		}
	},

	_addCircles: function() {
		this.set('circles', []);
		var self = this;
		this.pedestrians.forEach(function(pedestrian) {
			self.push('circles', new google.maps.Circle({
				strokeColor: '#FF0000',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#FF0000',
				fillOpacity: 0.35,
				map: self.$.map.map,
				center: {
					lat: pedestrian.lat,
					lng: pedestrian.long
				},
				radius: pedestrian.pcount * 50
			}));
		});
	},

	_removeCircles: function() {
		this.circles.forEach(function(circle) {
			circle.setMap(null);
		});
	}
});
