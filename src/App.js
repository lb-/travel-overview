import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import NumbericLabel from "react-pretty-numbers";
import transportItems from "./data/transports.json";
import airportItems from "./data/airports.json";
import { DateTime, Interval } from "luxon";
import {
  Container,
  Control,
  Field,
  Heading,
  Hero,
  Level,
  Section,
  SubTitle,
  Title
} from "reactbulma";
import "./App.css";
import ButtonLink from "./Buttons";
import { FlightsOverview, Flight } from "./Flights";

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

const App = () => (
  <Router>
    <main className="app">
      <Hero info bold>
        <Hero.Body>
          <Container>
            <Title>Travels</Title>
            <SubTitle>An overview of flights from 2017</SubTitle>
            <Field grouped>
              <Control>
                <ButtonLink
                  activeOnlyWhenExact={true}
                  to="/"
                  label="Overview"
                />
              </Control>
              <Control>
                <ButtonLink to="/flights" label="Flights" />
              </Control>
            </Field>
          </Container>
        </Hero.Body>
      </Hero>
      <Route exact path="/" component={RoutedOverview} />
      <Route path="/flights" component={Flights} />
    </main>
  </Router>
);

const RoutedOverview = ({ match }) => {
  return <Overview stats={travelStats} />;
};

const Overview = ({ stats }) => (
  <Section>
    <Level>
      <Level.Item hasTextCentered>
        <div>
          <Heading>Flights</Heading>
          <Title>{stats.totalFlights}</Title>
        </div>
      </Level.Item>
      <Level.Item hasTextCentered>
        <div>
          <Heading>Kilometers Flown</Heading>
          <Title>
            <NumbericLabel params={{ shortFormat: true, precision: 2 }}>
              {stats.totalDistanceFlown}
            </NumbericLabel>
          </Title>
        </div>
      </Level.Item>
      <Level.Item hasTextCentered>
        <div>
          <Heading>Time in Air</Heading>
          <Title>
            <NumbericLabel params={{ shortFormat: true, precision: 2 }}>
              {stats.totalMinutesFlown}
            </NumbericLabel>
          </Title>
        </div>
      </Level.Item>
      <Level.Item hasTextCentered>
        <div>
          <Heading>Airlines</Heading>
          <Title>{stats.totalDifferentAirlines}</Title>
        </div>
      </Level.Item>
    </Level>
  </Section>
);

const Flights = ({ match }) => (
  <Section>
    <Route exact path={match.url} render={RoutedFlightsOverview} />
    <Route path={`${match.url}/:flightNo`} component={RoutedFlight} />
  </Section>
);

const RoutedFlightsOverview = ({ match }) => {
  const titles = [
    null,
    "Flight",
    "Date",
    "Time (Minutes)",
    "Airline",
    "Airliner"
  ];
  return (
    <FlightsOverview
      match={match}
      titles={titles}
      flights={flightsWithLocations}
    />
  );
};

const RoutedFlight = ({ match }) => {
  const flight = flightsWithLocations.find(
    item => item.flightNo === match.params.flightNo
  );
  return <Flight {...flight} />;
};

export default App;
