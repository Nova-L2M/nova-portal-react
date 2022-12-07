import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import Boss from "./components/Boss";
import bossData from "./components/Boss/boss_data";
import { useEffect, useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import bgImg from "./images/background.jpeg";
import spinner from "./images/loading-spinner.svg";

export default function App() {
  // const { user, authIsReady } = useContext(AuthContext);
  const user = true,
    authIsReady = true;
  return authIsReady ? (
    user ? (
      <AuthenticatedApp user={user} />
    ) : (
      <UnauthenticatedApp />
    )
  ) : (
    <Loading />
  );
}

function Loading() {
  return (
    <>
      <GlobalStyle />
      <AppWrapper>
        <Container className="full-centered">
          <Row>
            <Column className="centered">
              <LoadingSpinner src={spinner} />
            </Column>
          </Row>
        </Container>
      </AppWrapper>
    </>
  );
}

function AuthenticatedApp() {
  let bosses = {};
  useEffect(() => {
    let isUpdating = Object.keys(bosses).length > 1;
    if (isUpdating) {
    } else {
      addBosses();
    }
  });
  function addBosses() {
    let bossTable = document.getElementById("boss-list");
    for (const boss in bossData) {
      let key = bossData[`${boss}`];
      let bossObject = new Boss(bossTable, {
        id: boss,
        name: key.name,
        image: boss,
        level: key.level,
        is_server_boss: key.is_server_boss,
        is_interval_timer: key.is_interval_timer,
        interval: key.interval,
        last_killed: key.last_killed,
        next_spawn: key.next_spawn,
        spawns: key.spawns,
        rarity: key.rarity,
        rate: key.rate,
        updated_by: key.updated_by
      });
      bosses[`${boss}`] = bossObject;
    }
  }
  return (
    <>
      <GlobalStyle />
      <AppWrapper>
        <Container>
          <Row>
            <Column>
              <table id="boss-list" cellPadding="0" cellSpacing="0">
                <thead>
                  <tr>
                    <th>Boss</th>
                    <th>Last</th>
                    <th>Next</th>
                    <th>Status</th>
                  </tr>
                </thead>
              </table>
            </Column>
          </Row>
        </Container>
      </AppWrapper>
    </>
  );
}

function UnauthenticatedApp() {
  return (
    <>
      <GlobalStyle />
      <AppWrapper>
        <Container className="full-centered">
          <Row>
            <Column className="centered">
              <LoginWrapper>
                <h1>Login Required</h1>
                <p>
                  You have to be a member of the Revolution alliance to use this
                  app.
                </p>
                <LoginButton>Authenticate with Discord</LoginButton>
              </LoginWrapper>
            </Column>
          </Row>
        </Container>
      </AppWrapper>
    </>
  );
}
const ctaColor = (opacity) => {
  return `rgb(255 103 0${opacity ? ` / ${opacity}%` : ""})`;
};
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    color: #fff;
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
  }

  img {
    max-width: 100%;
  }
  table {
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.3);
  }
  th,
  td {
    text-align: left;
    font-size: 12px;
  }
  td,
  th {
    padding: 10px 10px;
    border-right: none;
    border-left: none;
    border-spacing: 0px;
    border-collapse: collapse;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  th {
    text-transform: uppercase;
    font-size: 11px;
  }
  tbody tr {
    transition: all ease 0.2s;
    cursor: pointer;
  }

  tbody tr td {
    transition: all ease 0.2s;
  }

  tbody tr:hover td {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .td-row {
    display: flex;
    align-items: center;
    column-gap: 10px;
  }

  .td-column {
    display: flex;
    flex-direction: column;
  }
  .td-column h5 {
    margin: 0;
    text-transform: uppercase;
  }

  .boss-avatar-wrapper {
    width: 34px;
    height: 34px;
    padding: 0;
    border: 1px solid hsla(0, 0%, 100%, 0.36);
    border-radius: 100px;
    -o-object-fit: cover;
    object-fit: cover;
    -o-object-position: 50% 50%;
    object-position: 50% 50%;
    overflow: hidden;
    flex: none;
  }

  .boss-name-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .boss-name-wrapper h4.boss-name {
    text-transform: uppercase;
    margin: 0px;
    font-size: 14px;
    color: #f6ca82;
    text-shadow: 1px 1px 6px red;
  }
  .boss-details {
    display: flex;
    column-gap: 5px;
    text-transform: uppercase;
    font-size: 11px;
    flex-shrink: 1;
    flex-wrap: wrap;
  }

  h5.subdue {
    opacity: 0.4;
  }
  h5.updatedby {
    font-weight: 300;
    text-transform: none;
    font-style: italic;
  }
`;
const AppWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  position: relative;
  background-image: linear-gradient(
      180deg,
      rgba(7, 13, 18, 0.66),
      rgba(7, 13, 18, 0.66)
    ),
    url("${bgImg}");
  background-size: contain;
  background-repeat: no-repeat;
  background-color: #000;
  padding: 20px 0;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  &.full-centered {
    flex-grow: 1;
    justify-content: center;
  }
`;
const Row = styled.div`
  display: flex;
  width: 100%;
  max-width: 1040px;
  padding: 0 20px;
`;
const Column = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  &.centered {
    justify-content: center;
    align-items: center;
  }
`;
const LoadingSpinner = styled.img`
  width: 90px;
  align-self: center;
`;
const LoginWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: rgb(0 0 0 / 30%);
  min-height: 100px;
  border: 1px solid rgb(255 255 255 / 30%);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  row-gap: 15px;
  & h1 {
    width: 100%;
    text-align: center;
    text-transform: uppercase;
    font-size: 24px;
  }
  & p {
    width: 100%;
    text-align: center;
  }
`;
const LoginButton = styled.button`
  padding: 20px 20px;
  cursor: pointer;
  background-color: ${ctaColor(60)};
  outline: none;
  border: 1px solid ${ctaColor()};
  border-radius: 3px;
  color: #fff;
  font-weight: 200;
  text-transform: uppercase;
  text-shadow: 1px 0px 1px ${ctaColor}, 0px 1px 1px ${ctaColor},
    1px 1px 1px ${ctaColor}, -1px 0px 1px ${ctaColor}, 0px -1px 1px ${ctaColor},
    -1px -1px 1px ${ctaColor};
  box-shadow: 0px 0px 15px 0px red;
  transition: all ease 0.2s;
  &:hover {
    background-color: ${ctaColor(100)};
  }
`;
