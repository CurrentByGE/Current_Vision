Polymer({

  is: 'analytics-screen',

  properties: {
    pins: {
      type: Object,
      value: [{
        name: "Zone 1"
      }, {
        name: "Zone 2"
      }, {
        name: "Zone 3"
      }]
    },
    suggestions: {
      type: Object,
      value: [
        "Between 3:00pm and 4:00pm, there are less pedestrians and it is an optimal time to build",
        "After 6:00pm on Oak Street, there are less pedestrians and it is an optimal time to build",
        "There are no pedestrians on Moreland Way after 9:00pm and it is an optimal time to build",
        "There are no pedestrians on Shattuck Ave after 3:00pm and it is an optimal time to build"
      ]
    },
    lineData: {
      type: Object,
      value: {
        labels: ["January", "February", "March", "April", "May", "June",
          "July"
        ],
        datasets: [{
          label: "Number of Pedestrians",
          backgroundColor: "rgba(151,187,205,0.2)",
          borderColor: "rgba(151,187,205,1)",
          borderWidth: 1,
          data: [65, 59, 80, 81, 56, 55, 40]
        }]
      },
      notify: true
    },
    lineCarData: {
      type: Object,
      value: {
        labels: ["January", "February", "March", "April", "May", "June",
          "July"
        ],
        datasets: [{
          label: "Number of Vehicles",
          backgroundColor: "rgba(220,220,220,0.2)",
          borderColor: "rgba(220,220,220,1)",
          borderWidth: 1,
          data: [65, 59, 80, 81, 56, 55, 40]
        }]
      },
      notify: true
    },
    barData: {
      type: Object,
      value: {
        labels: ["9", "10", "11", "12", "13", "14",
          "15"
        ],
        datasets: [{
          label: "Number of Pedestrians Per Hour",
          backgroundColor: "rgba(151,187,205,0.2)",
          borderColor: "rgba(151,187,205,1)",
          borderWidth: 1,
          data: [28, 48, 40, 19, 86, 27, 90]
        }]
      },
      notify: true
    }
  },

  refresh: function(e) {
    if (e) {
      window.location.href = "/";
    }
  }
});
