import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Section } from "reactbulma";
import "./App.css";
import { HeroHeader, Overview } from "./General";
import { FlightsOverview, Flight } from "./Flights";
import { flightsWithLocations, travelStats } from "./data/Data";

const App = () => (
  <Router>
    <main className="app">
      <HeroHeader />
      <Route exact path="/" component={RoutedOverview} />
      <Route path="/flights" component={FlightsSection} />
    </main>
  </Router>
);

const RoutedOverview = ({ match }) => {
  return <Overview stats={travelStats} flights={flightsWithLocations} />;
};

const FlightsSection = ({ match }) => (
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
