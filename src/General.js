import React from "react";
import {
  Button,
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
import NumbericLabel from "react-pretty-numbers";
import { Route, Link } from "react-router-dom";

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

const HeroHeader = () => (
  <Hero info bold>
    <Hero.Body>
      <Container>
        <Title>Travels</Title>
        <SubTitle>An overview of flights from 2017</SubTitle>
        <Field grouped>
          <Control>
            <ButtonLink activeOnlyWhenExact={true} to="/" label="Overview" />
          </Control>
          <Control>
            <ButtonLink to="/flights" label="Flights" />
          </Control>
        </Field>
      </Container>
    </Hero.Body>
  </Hero>
);

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

export { ButtonLink, HeroHeader, Overview };
