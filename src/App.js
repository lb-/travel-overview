import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import NumbericLabel from "react-pretty-numbers";
import transportItems from "./data/transports.json";
import airportItems from "./data/airports.json";
import "./App.css";
import { compose, withProps } from "recompose";
import { DateTime, Interval } from "luxon";
import {
  Button,
  Card,
  Container,
  Content,
  Control,
  Field,
  Heading,
  Hero,
  Image,
  Level,
  Media,
  Section,
  SubTitle,
  Table,
  Title
} from "reactbulma";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Polyline
} from "react-google-maps";

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

const ButtonLink = ({ label, to, activeOnlyWhenExact }) => (
  <Route
    path={to}
    exact={activeOnlyWhenExact}
    children={({ match }) => (
      <Button className={match ? "is-active" : ""}>
        <Link to={to}>{label}</Link>
      </Button>
    )}
  />
);

const FlightMap = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => {
  const bounds = new window.google.maps.LatLngBounds();
  bounds.extend(new window.google.maps.LatLng(props.fromLocation));
  bounds.extend(new window.google.maps.LatLng(props.toLocation));
  return (
    <GoogleMap
      defaultZoom={8}
      defaultCenter={props.toLocation}
      ref={map => map && map.fitBounds(bounds)}
    >
      <Marker position={props.fromLocation} label="A" />
      <Marker position={props.toLocation} label="B" />
      <Polyline
        path={[props.fromLocation, props.toLocation]}
        strokeColor={"#FFFFFF"}
        strokeWeight={3}
      />
    </GoogleMap>
  );
});

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

const FlightsOverview = ({ flights, match, titles }) => (
  <Table hoverable striped className="is-fullwidth">
    <Table.Head>
      <FlightTableHeaderRow titles={titles} />
    </Table.Head>
    <Table.Body>
      {flights.map((item, index) => (
        <FlightTableRow {...item} match={match} key={item.flightNo} />
      ))}
    </Table.Body>
    <Table.Foot>
      <FlightTableHeaderRow titles={titles} />
      <FlightTableTotalsRow items={flights} />
    </Table.Foot>
  </Table>
);

const FlightTableHeaderRow = ({ titles }) => (
  <Table.Tr>
    {titles.map(
      (title, index) =>
        title !== null ? (
          <Table.Th key={index}>{title}</Table.Th>
        ) : (
          <Table.Th key={index} />
        )
    )}
  </Table.Tr>
);

const FlightTableTotalsRow = ({ items }) => (
  <Table.Tr>
    <Table.Th>Totals</Table.Th>
    <Table.Th>{items.length}</Table.Th>
    <Table.Th />
    <Table.Th>
      {items.reduce((total, item) => item.timeMinutes + total, 0)}
    </Table.Th>
    <Table.Th>
      {
        items.reduce(
          (arr, item) =>
            arr.includes(item.provider) ? arr : arr.concat([item.provider]),
          []
        ).length
      }
    </Table.Th>
    <Table.Th>
      {
        items.reduce((arr, item) => {
          const airliner = item.aircraftName + item.aircraftCode;
          return arr.includes(airliner) ? arr : arr.concat([airliner]);
        }, []).length
      }
    </Table.Th>
  </Table.Tr>
);

const FlightTableRow = ({
  flightNo,
  match,
  fromAirport,
  toAirport,
  fromDatetime,
  timeMinutes,
  provider,
  aircraftCode,
  aircraftName
}) => (
  <Table.Tr>
    <Table.Td>
      <ButtonLink to={`${match.url}/${flightNo}`} label={`View ${flightNo}`} />
    </Table.Td>
    <Table.Td>
      {fromAirport.airportCode} &rarr; {toAirport.airportCode}
    </Table.Td>
    <Table.Td>
      {DateTime.fromISO(fromDatetime).toLocaleString({
        month: "long",
        day: "numeric"
      })}
    </Table.Td>
    <Table.Td>{timeMinutes}</Table.Td>
    <Table.Td>{provider}</Table.Td>
    <Table.Td>
      {aircraftName} {aircraftCode}
    </Table.Td>
  </Table.Tr>
);

const RoutedFlight = ({ match }) => {
  const flight = flightsWithLocations.find(
    item => item.flightNo === match.params.flightNo
  );
  return <Flight {...flight} />;
};

const Flight = ({
  aircraftCode,
  aircraftName,
  airlineLogoLocation,
  distanceKilometers,
  flightNo,
  fromAirport,
  interval,
  provider,
  toAirport
}) => (
  <Card>
    <FlightMap
      fromLocation={{
        lat: fromAirport.latitude,
        lng: fromAirport.longitude
      }}
      toLocation={{
        lat: toAirport.latitude,
        lng: toAirport.longitude
      }}
    />
    <Card.Content>
      <Media>
        <Media.Left>
          <Image
            is="128x128"
            src={process.env.PUBLIC_URL + airlineLogoLocation}
            alt={`${provider} Logo`}
          />
        </Media.Left>
        <Media.Content>
          <Title is="4">
            {toAirport.airportCode} &rarr; {fromAirport.airportCode}
          </Title>
          <SubTitle is="6">
            {toAirport.airportName}, {toAirport.countryName}
            &nbsp;&rarr;&nbsp;
            {fromAirport.airportName}, {fromAirport.countryName}
          </SubTitle>
          <Content>
            <dl>
              <dt>Airline:</dt>
              <dd>
                <strong>{provider}</strong>
              </dd>
              <dt>Airliner:</dt>
              <dd>
                <strong>
                  {aircraftName} {aircraftCode}
                </strong>
              </dd>
              <dt>Times:</dt>
              <dd>
                <strong>
                  {interval.start.toLocaleString(DateTime.DATETIME_MED)}
                  to
                  {interval.end.toLocaleString(DateTime.DATETIME_MED)}
                </strong>
              </dd>
              <dd>{interval.length("minutes")} minutes</dd>
              <dt>Distance:</dt>
              <dd>
                <strong>
                  <NumbericLabel params={{ precision: 2, justification: "L" }}>
                    {distanceKilometers}
                  </NumbericLabel>{" "}
                  KMs
                </strong>
                <br />
                <small>
                  <sup>*</sup> Great circle distance
                </small>
              </dd>
            </dl>
          </Content>
        </Media.Content>
        <Media.Right>{flightNo}</Media.Right>
      </Media>
    </Card.Content>
  </Card>
);

export default App;
