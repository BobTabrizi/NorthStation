import "./App.css";
import axios from "axios";
import React, { useEffect, useState } from "react";

function App() {
  //State hook for train data
  const [trains, setTrains] = useState(null);

  //JS Moment library used to parse and translate timestamps
  var moment = require("moment-timezone");

  //Pull data from API
  const fetchAPIData = async () => {
    axios
      .get(
        "https://api-v3.mbta.com/schedules?include=route,trip,stop&filter[route]=CR-Haverhill,CR-Lowell,CR-Newburyport,CR-Fitchburg&filter[stop]=place-north&sort=arrival_time"
      )
      .then((res) => {
        //Filter for the latest train data.
        let parseLatestTrains = res.data.data.filter(
          (item) =>
            moment(item.attributes.arrival_time).format("x") >
            moment().format("x")
        );

        //Then clean the data for potential invalid times
        let cleanedData = parseLatestTrains.filter(
          (item) =>
            moment(item.attributes.arrival_time)
              .tz("America/New_York")
              .format("MMMM Do YYYY, h:mm:ss a") !== "Invalid date" ||
            item.attributes.arrival_time !== null
        );
        setTrains(cleanedData);
      });
  };

  useEffect(() => {
    //Populate Data on page load.
    if (trains === null) fetchAPIData();
  });
  return (
    <div className="Container">
      <div className="boardWrapper">
        <div className="dateInformation">
          <div className="currentDay">
            {moment().tz("America/New_York").format("LLLL")}
          </div>
        </div>
        <p>NORTH STATION INFORMATION</p>
        <div className="boardHeader">
          <div>TIME</div>
          <div className="destinationHeader">DESTINATION</div>
        </div>
        <div className="trains">
          {trains &&
            trains.map((train, index) => {
              const cleanedDate = moment(train.attributes.arrival_time)
                .tz("America/New_York")
                .format("h:mm A");
              console.log(
                moment(train.attributes.arrival_time).format("x") >
                  moment().format("x")
              );
              return (
                <div className="trainListing">
                  <div className="arrivalTimes">{cleanedDate}</div>
                  <div className="destinations">
                    {train.relationships.route.data.id.substring(3)}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
