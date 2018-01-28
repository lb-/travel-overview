import React from "react";
import NumbericLabel from "react-pretty-numbers";
import { compose, withProps } from "recompose";
import { DateTime } from "luxon";
import {
  Card,
  Content,
  Image,
  Media,
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
import { ButtonLink } from "./General";

const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const googleMapsBaseUrl = "https://maps.googleapis.com/maps/api/js";
const googleMapsURL = `${googleMapsBaseUrl}?key=${googleMapsApiKey}&v=3.exp&libraries=geometry,drawing,places`;
const googleMapsPathOptions = {
  strokeColor: "#f36f54",
  strokeWeight: 4
};

const FlightsOverview = ({ flights, match, titles }) => (
  <Table hoverable striped className="is-fullwidth">
    <Table.Head>
      <FlightsTableHeaderRow titles={titles} />
    </Table.Head>
    <Table.Body>
      {flights.map((item, index) => (
        <FlightsTableRow {...item} match={match} key={item.flightNo} />
      ))}
    </Table.Body>
    <Table.Foot>
      <FlightsTableHeaderRow titles={titles} />
      <FlightsTableTotalsRow items={flights} />
    </Table.Foot>
  </Table>
);

const FlightsTableHeaderRow = ({ titles }) => (
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

const FlightsTableTotalsRow = ({ items }) => (
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

const FlightsTableRow = ({
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
                  {`${interval.start.toLocaleString(
                    DateTime.DATETIME_MED
                  )} to ${interval.end.toLocaleString(DateTime.DATETIME_MED)}`}
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

const FlightMap = compose(
  withProps({
    googleMapURL: googleMapsURL,
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
        options={googleMapsPathOptions}
      />
    </GoogleMap>
  );
});

const FlightsMap = compose(
  withProps({
    googleMapURL: googleMapsURL,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => {
  const bounds = new window.google.maps.LatLngBounds();
  console.log("foo");
  const markerLocations = props.flights.reduce((locations, flight) => {
    const fromLocation = {
      lat: flight.fromAirport.latitude,
      lng: flight.fromAirport.longitude
    };
    const toLocation = {
      lat: flight.toAirport.latitude,
      lng: flight.toAirport.longitude
    };
    const fromLocationKey = `${fromLocation.lat}_${fromLocation.lng}`;
    const toLocationKey = `${toLocation.lat}_${toLocation.lng}`;
    if (!Object.keys(locations).includes(fromLocationKey)) {
      locations[fromLocationKey] = fromLocation;
      bounds.extend(new window.google.maps.LatLng(fromLocation));
    }
    if (!Object.keys(locations).includes(toLocationKey)) {
      locations[toLocationKey] = toLocation;
      bounds.extend(new window.google.maps.LatLng(toLocation));
    }
    return locations;
  }, {});
  return (
    <GoogleMap
      defaultZoom={8}
      defaultCenter={props.toLocation}
      ref={map => map && map.fitBounds(bounds)}
    >
      {Object.entries(markerLocations).map(([key, position]) => (
        <Marker position={position} key={key} />
      ))}
    </GoogleMap>
  );
});

export { FlightsOverview, Flight, FlightsMap };
