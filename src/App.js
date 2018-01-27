import React, { Component } from "react";
import logoVirginAustralia from "./images/airlines/virgin-australia-logo.png";
import "./App.css";
import { compose, withProps } from "recompose";
import {
  Button,
  Card,
  Container,
  Content,
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
// const { LatLng, LatLngBounds } = window.google.maps;

const MapComponentWithFlight = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
    locationA: { lat: -27.384167, lng: 153.1175, airport_code: "BNE" },
    locationB: { lat: 1.350189, lng: 103.994433, airport_code: "SIN" },
    fitMarkerBounds: () => {
      const bounds = this.getBounds();
      const markerBounds = [
        { lat: -27.384167, lng: 153.1175 },
        { lat: 1.350189, lng: 103.994433 }
      ];
      markerBounds.forEach(bound => bounds.extend(bound));
      this.refs.map.fitBounds(bounds);
    }
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: props.locationA.lat, lng: props.locationA.lng }}
    onTilesloaded={() => props.fitMarkerBounds()}
  >
    <Marker
      position={{ lat: props.locationA.lat, lng: props.locationA.lng }}
      label={"A"}
    />
    <Marker
      position={{ lat: props.locationB.lat, lng: props.locationB.lng }}
      label={"B"}
    />
    <Polyline
      path={[
        { lat: props.locationA.lat, lng: props.locationA.lng },
        { lat: props.locationB.lat, lng: props.locationB.lng }
      ]}
      strokeColor={"#FFFFFF"}
      strokeWeight={3}
    />
  </GoogleMap>
));

class App extends Component {
  render() {
    return (
      <main className="App">
        <Section>
          <Hero info bold>
            <Hero.Body>
              <Container>
                <Title>Flights</Title>
                <SubTitle>An overview of flights from 2017</SubTitle>
              </Container>
            </Hero.Body>
          </Hero>
        </Section>
        <Section>
          <Level>
            <Level.Item hasTextCentered>
              <div>
                <Heading>Flights</Heading>
                <Title>21</Title>
              </div>
            </Level.Item>
            <Level.Item hasTextCentered>
              <div>
                <Heading>Kilometers Flown</Heading>
                <Title>123,000</Title>
              </div>
            </Level.Item>
            <Level.Item hasTextCentered>
              <div>
                <Heading>Minutes in Air</Heading>
                <Title>456,000</Title>
              </div>
            </Level.Item>
            <Level.Item hasTextCentered>
              <div>
                <Heading>Airlines</Heading>
                <Title>5</Title>
              </div>
            </Level.Item>
          </Level>
        </Section>
        <Section>
          <Table hoverable striped className="is-fullwidth">
            <Table.Head>
              <Table.Tr>
                <Table.Th />
                <Table.Th>Flight</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Time (Minutes)</Table.Th>
                <Table.Th>Airline</Table.Th>
                <Table.Th>Airliner</Table.Th>
              </Table.Tr>
            </Table.Head>
            <Table.Body>
              <Table.Tr>
                <Table.Td>
                  <Button>View</Button>
                </Table.Td>
                <Table.Td>BNE &rarr; SIN</Table.Td>
                <Table.Td>2017-01-12</Table.Td>
                <Table.Td>480</Table.Td>
                <Table.Td>Virgin Australia</Table.Td>
                <Table.Td>Airbus</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <Button>View</Button>
                </Table.Td>
                <Table.Td>SIN &rarr; SGN</Table.Td>
                <Table.Td>2017-01-12</Table.Td>
                <Table.Td>130</Table.Td>
                <Table.Td>Virgin Australia</Table.Td>
                <Table.Td>Airbus</Table.Td>
              </Table.Tr>
            </Table.Body>
            <Table.Foot>
              <Table.Tr>
                <Table.Th>Totals</Table.Th>
                <Table.Th>21</Table.Th>
                <Table.Th />
                <Table.Th>312</Table.Th>
                <Table.Th>10</Table.Th>
                <Table.Th>4</Table.Th>
              </Table.Tr>
              <Table.Tr>
                <Table.Th />
                <Table.Th>Flight</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Time (Minutes)</Table.Th>
                <Table.Th>Airline</Table.Th>
                <Table.Th>Airliner</Table.Th>
              </Table.Tr>
            </Table.Foot>
          </Table>
        </Section>
        <Section>
          <Card>
            <Card.Content>
              <Media>
                <Media.Left>
                  <Image
                    is="128x128"
                    src={logoVirginAustralia}
                    alt="Virgin Australia Logo"
                  />
                </Media.Left>
                <Media.Content>
                  <Title is="4">BNE &rarr; SIN</Title>
                  <SubTitle is="6">
                    Brisbane, Australia to Singapore, Singapore
                  </SubTitle>
                  <Content>
                    Airline: <strong>Virgin Australia</strong>
                    <br />
                    Airliner: <strong>Airbus A359</strong>
                    <br />
                    Time: <strong>480 minutes</strong>
                    <br />
                    Distance:{" "}
                    <strong>
                      6142.4 kilometers <sup>*</sup>
                    </strong>
                    <br />
                    Dates:{" "}
                    <strong>
                      {" "}
                      11:09 PM - 1 Jan 2016 to 12:18 PM - 1 Jan 2017
                    </strong>
                    <p>
                      <small>
                        <sup>*</sup> Great circle distance from{" "}
                        <a href="https://www.world-airport-codes.com/distance">
                          World Airport Codes
                        </a>
                      </small>
                    </p>
                  </Content>
                </Media.Content>
                <Media.Right>VA5668</Media.Right>
              </Media>
              <MapComponentWithFlight />
            </Card.Content>
          </Card>
        </Section>
      </main>
    );
  }
}

export default App;
