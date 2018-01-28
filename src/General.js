import React from "react";
import {
  Button,
  Container,
  Control,
  Field,
  Icon,
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
      <Button className={match ? "is-active" : ""} light>
        <Link to={to}>{label}</Link>
      </Button>
    )}
  />
);

const HeroHeader = () => (
  <Hero bold className="branded">
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
          <Icon large>
            <i className="fas fa-3x fa-plane" />
          </Icon>
          <Title>{stats.totalFlights}</Title>
          <Heading>Flights</Heading>
        </div>
      </Level.Item>
      <Level.Item hasTextCentered>
        <div>
          <Icon large>
            <i className="fas fa-3x fa-globe" />
          </Icon>

          <Title>
            <NumbericLabel params={{ shortFormat: true, precision: 2 }}>
              {stats.totalDistanceFlown}
            </NumbericLabel>
          </Title>
          <Heading>Kilometers Flown</Heading>
        </div>
      </Level.Item>
      <Level.Item hasTextCentered>
        <div>
          <Icon large>
            <i className="fas fa-3x fa-clock" />
          </Icon>

          <Title>
            <NumbericLabel params={{ shortFormat: true, precision: 2 }}>
              {stats.totalMinutesFlown}
            </NumbericLabel>
          </Title>
          <Heading>Time in Air</Heading>
        </div>
      </Level.Item>
      <Level.Item hasTextCentered>
        <div>
          <Icon large>
            <i className="fas fa-3x fa-fighter-jet" />
          </Icon>

          <Title>{stats.totalDifferentAirlines}</Title>
          <Heading>Airlines</Heading>
        </div>
      </Level.Item>
    </Level>
  </Section>
);

export { ButtonLink, HeroHeader, Overview };
