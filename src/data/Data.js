import transportItems from "./transports.json";
import airportItems from "./airports.json";
import { DateTime, Interval } from "luxon";

const flightsWithLocations = transportItems
  .filter(item => item.method === "Flight")
  .map(item => {
    let flight = Object.assign({}, item);
    flight.toAirport = airportItems.find(
      item => item.airportCode === flight.toAirport
    );
    flight.fromAirport = airportItems.find(
      item => item.airportCode === flight.fromAirport
    );
    flight.interval = Interval.fromDateTimes(
      DateTime.fromISO(flight.fromDatetime),
      DateTime.fromISO(flight.toDatetime)
    );
    const airlineLogo = flight.provider
      .trim()
      .toLowerCase()
      .replace(" ", "-");
    flight.airlineLogoLocation = `/img/airlines/${airlineLogo}.svg`;
    return flight;
  });

const travelStats = {
  totalFlights: flightsWithLocations.length,
  totalDistanceFlown: flightsWithLocations.reduce(
    (total, item) => total + item.distanceKilometers,
    0
  ),
  totalMinutesFlown: flightsWithLocations.reduce(
    // change to a duration and represent as hours, minutes
    (total, item) => total + item.timeMinutes,
    0
  ),
  totalDifferentAirlines: flightsWithLocations.reduce(
    (arr, item) =>
      arr.includes(item.provider) ? arr : arr.concat([item.provider]),
    []
  ).length
};

export { flightsWithLocations, travelStats };
