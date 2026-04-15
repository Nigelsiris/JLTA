const SHEET_DEFINITIONS = {
  Config: ["key", "value"],
  Lines: ["line", "hexColor", "stationCount"],
  Stations: ["name", "line", "latitude", "longitude", "order"],
  PointsOfInterest: ["name", "category", "latitude", "longitude"]
};

function doGet() {
  const template = HtmlService.createTemplateFromFile("Index");
  template.mapDataEncoded = encodeURIComponent(JSON.stringify(getMetroData()));
  return template
    .evaluate()
    .setTitle("DC Metro Explorer")
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

function initializeSpreadsheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  Object.keys(SHEET_DEFINITIONS).forEach((name) => {
    const headers = SHEET_DEFINITIONS[name];
    const sheet = spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
    sheet.clear();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  });

  syncMetroDataToSheets();
}

function syncMetroDataToSheets() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const data = getMetroData();

  const linesSheet = spreadsheet.getSheetByName("Lines");
  const stationsSheet = spreadsheet.getSheetByName("Stations");
  const poiSheet = spreadsheet.getSheetByName("PointsOfInterest");
  const configSheet = spreadsheet.getSheetByName("Config");

  if (!linesSheet || !stationsSheet || !poiSheet || !configSheet) {
    throw new Error("Run initializeSpreadsheet() first to create the required sheets.");
  }

  const lineRows = data.lines.map((line) => [line.name, line.color, line.stations.length]);

  const stationRows = [];
  data.lines.forEach((line) => {
    line.stations.forEach((station, index) => {
      stationRows.push([station.name, line.name, station.lat, station.lng, index + 1]);
    });
  });

  const poiRows = data.pointsOfInterest.map((poi) => [poi.name, poi.category, poi.lat, poi.lng]);

  const configRows = [
    ["last_synced", new Date().toISOString()],
    ["line_count", String(data.lines.length)],
    ["station_count", String(stationRows.length)],
    ["poi_count", String(poiRows.length)]
  ];

  clearAndWriteRows(linesSheet, lineRows, 3);
  clearAndWriteRows(stationsSheet, stationRows, 5);
  clearAndWriteRows(poiSheet, poiRows, 4);
  clearAndWriteRows(configSheet, configRows, 2);
}

function getMetroData() {
  return {
    lines: [
      {
        name: "Red",
        color: "#be1337",
        stations: [
          { name: "Shady Grove", lat: 39.1199, lng: -77.1647 },
          { name: "Rockville", lat: 39.084, lng: -77.1464 },
          { name: "Twinbrook", lat: 39.0625, lng: -77.1216 },
          { name: "White Flint", lat: 39.0474, lng: -77.1128 },
          { name: "Grosvenor-Strathmore", lat: 39.0299, lng: -77.1043 },
          { name: "Bethesda", lat: 38.9845, lng: -77.0947 },
          { name: "Friendship Heights", lat: 38.9607, lng: -77.0859 },
          { name: "Dupont Circle", lat: 38.9096, lng: -77.0434 },
          { name: "Metro Center", lat: 38.8983, lng: -77.0281 },
          { name: "Union Station", lat: 38.8971, lng: -77.0063 },
          { name: "Rhode Island Ave", lat: 38.9207, lng: -76.9959 },
          { name: "Silver Spring", lat: 38.9938, lng: -77.0317 },
          { name: "Glenmont", lat: 39.0617, lng: -77.0532 }
        ]
      },
      {
        name: "Blue",
        color: "#0076bf",
        stations: [
          { name: "Franconia-Springfield", lat: 38.7669, lng: -77.1688 },
          { name: "Van Dorn Street", lat: 38.7992, lng: -77.129 },
          { name: "King St-Old Town", lat: 38.8064, lng: -77.0612 },
          { name: "Braddock Road", lat: 38.814, lng: -77.0538 },
          { name: "Ronald Reagan Washington National Airport", lat: 38.8521, lng: -77.0432 },
          { name: "Pentagon", lat: 38.8695, lng: -77.0541 },
          { name: "Smithsonian", lat: 38.888, lng: -77.0281 },
          { name: "Metro Center", lat: 38.8983, lng: -77.0281 },
          { name: "McPherson Square", lat: 38.9012, lng: -77.0339 },
          { name: "Rosslyn", lat: 38.896, lng: -77.0714 },
          { name: "Arlington Cemetery", lat: 38.8846, lng: -77.0632 },
          { name: "Largo Town Center", lat: 38.9008, lng: -76.8449 }
        ]
      },
      {
        name: "Orange",
        color: "#f7941d",
        stations: [
          { name: "Vienna", lat: 38.8777, lng: -77.2715 },
          { name: "Dunn Loring", lat: 38.883, lng: -77.2288 },
          { name: "West Falls Church", lat: 38.9007, lng: -77.1888 },
          { name: "Ballston-MU", lat: 38.8824, lng: -77.1118 },
          { name: "Clarendon", lat: 38.8865, lng: -77.0969 },
          { name: "Rosslyn", lat: 38.896, lng: -77.0714 },
          { name: "Foggy Bottom", lat: 38.9007, lng: -77.0502 },
          { name: "Metro Center", lat: 38.8983, lng: -77.0281 },
          { name: "Federal Triangle", lat: 38.8949, lng: -77.0282 },
          { name: "L'Enfant Plaza", lat: 38.884, lng: -77.0218 },
          { name: "Stadium-Armory", lat: 38.8867, lng: -76.9771 },
          { name: "New Carrollton", lat: 38.9478, lng: -76.8719 }
        ]
      },
      {
        name: "Green",
        color: "#00a651",
        stations: [
          { name: "Greenbelt", lat: 39.011, lng: -76.9115 },
          { name: "College Park-U of Md", lat: 38.9787, lng: -76.9284 },
          { name: "Fort Totten", lat: 38.9518, lng: -77.0022 },
          { name: "Columbia Heights", lat: 38.9281, lng: -77.0326 },
          { name: "U Street", lat: 38.917, lng: -77.028 },
          { name: "Gallery Place", lat: 38.8981, lng: -77.0219 },
          { name: "Archives", lat: 38.8921, lng: -77.0229 },
          { name: "L'Enfant Plaza", lat: 38.884, lng: -77.0218 },
          { name: "Navy Yard-Ballpark", lat: 38.8764, lng: -77.0051 },
          { name: "Anacostia", lat: 38.862, lng: -76.9952 },
          { name: "Congress Heights", lat: 38.8454, lng: -76.988 },
          { name: "Branch Avenue", lat: 38.8264, lng: -76.9123 }
        ]
      },
      {
        name: "Silver",
        color: "#a2a4a1",
        stations: [
          { name: "Ashburn", lat: 39.0436, lng: -77.4875 },
          { name: "Loudoun Gateway", lat: 38.9948, lng: -77.4608 },
          { name: "Dulles Airport", lat: 38.9531, lng: -77.4482 },
          { name: "Reston Town Center", lat: 38.9523, lng: -77.3602 },
          { name: "Wiehle-Reston East", lat: 38.9475, lng: -77.3392 },
          { name: "Tysons", lat: 38.9202, lng: -77.2229 },
          { name: "East Falls Church", lat: 38.8852, lng: -77.1572 },
          { name: "Rosslyn", lat: 38.896, lng: -77.0714 },
          { name: "Metro Center", lat: 38.8983, lng: -77.0281 },
          { name: "L'Enfant Plaza", lat: 38.884, lng: -77.0218 },
          { name: "Benning Road", lat: 38.8893, lng: -76.941 },
          { name: "Downtown Largo", lat: 38.9008, lng: -76.8449 }
        ]
      }
    ],
    pointsOfInterest: [
      { name: "White House", category: "Landmark", lat: 38.8977, lng: -77.0365 },
      { name: "U.S. Capitol", category: "Landmark", lat: 38.8899, lng: -77.0091 },
      { name: "National Mall", category: "Park", lat: 38.8893, lng: -77.0502 },
      { name: "Georgetown Waterfront", category: "Neighborhood", lat: 38.9037, lng: -77.0622 },
      { name: "Old Town Alexandria", category: "Neighborhood", lat: 38.8048, lng: -77.0469 },
      { name: "Arlington National Cemetery", category: "Landmark", lat: 38.8783, lng: -77.0687 }
    ]
  };
}

function clearAndWriteRows(sheet, rows, width) {
  // Always preserve row 1 headers; clear only data rows below them.
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, width).clearContent();
  }

  if (!rows.length) {
    return;
  }

  sheet.getRange(2, 1, rows.length, width).setValues(rows);
}
