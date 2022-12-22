import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import Boss from "./components/Boss";
import { useEffect, useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import {
  Routes,
  Route,
  useSearchParams
} from "react-router-dom";
import { useLogin } from "./hooks/useLogin";
import bgImg from "./images/background.jpeg";
import spinner from "./images/loading-spinner.svg";
import Bosses from "./pages/Bosses";
import Login from "./pages/Login";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "./firebase/config";
import Isotope from "isotope-layout";

export default function App() {
  const { user, authIsReady } = useContext(AuthContext);
  // const user = true,
  //   authIsReady = true;
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
      <Routes>
        <Route exact path="/" element={
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
        } />
      </Routes>
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
  async function addBosses() {
    let bossTable = document.getElementById("boss-list-body");
    const q = query(collection(db, "bosses"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
          let key = doc.id;
          let bossObject = new Boss(bossTable, {
            id: key,
            name: doc.data().name,
            image: doc.id,
            level: doc.data().level,
            is_server_boss: doc.data().is_server_boss,
            is_interval_timer: doc.data().is_interval_timer,
            interval: doc.data().interval,
            last_killed: doc.data().last_killed,
            next_spawn: doc.data().next_spawn,
            spawns: doc.data().spawns,
            rarity: doc.data().rarity,
            rate: doc.data().rate,
            updated_by: doc.data().updated_by
          });
          bosses[`${key}`] = bossObject;
          // if this is the last boss, then init set column widths and init isotope
          if (Object.keys(bosses).length === querySnapshot.size) {
            setTable(initIsotope);
          }
      });
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
            console.log("Modified Boss: ", change.doc.data());
            let key = change.doc.id;
            let bossObject = bosses[`${key}`];
            bossObject.updateBoss(change.doc.data());
        }
      });
    });
  }
  function setTable(callback) {
    // Set the width for each column in the table header
    let headerArray = document.querySelectorAll("th");
    headerArray.forEach((header) => {
      let width = header.offsetWidth;
      header.style.width = `${width}px`;
    });
    // TODO: Set the width for each column
    let rowArray = document.querySelectorAll(".boss-row");
    rowArray.forEach((row) => {
      let columnArray = row.querySelectorAll("td");
      columnArray.forEach((column) => {
        let width = column.offsetWidth;
        column.style.width = `${width}px`;
      });
    });
    if (callback) {
      callback();
    }
  }
  function initIsotope() {
    // init Isotope
    console.log('init isotope');
    var iso = new Isotope( '#boss-list', {
      itemSelector: '.boss-row',
      layoutMode: 'vertical',
      getSortData: {
        timestamp: '[data-timestamp] parseInt'
      }
    });
    // sort by timestamp
    iso.arrange({ sortBy: 'timestamp' });
    // adjust height of boss-list-body
    let bossListBody = document.getElementById("boss-list-body");
    let bossList = document.getElementById("boss-list");
    bossListBody.style.height = `${bossList.offsetHeight}px`;
  }
  return (
      <Routes>
        <Route exact path="/" element={
          <>
            <GlobalStyle />
            <AppWrapper>
              <Bosses />
            </AppWrapper>
          </>
        } />
      </Routes>
  );
}

function UnauthenticatedApp() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { login, isPending } = useLogin();

  useEffect(() => {
    if (token) {
      login(token);
    }
  }, [token, login]);

  return (
      <Routes>
        <Route exact path="/" element={
          <>
            <GlobalStyle />
            <Login isPending={isPending} />
          </>
        } />
      </Routes>
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
  .boss-row {
    width: 100%;
  }
  #boss-list-body {
    position:relative;
  }
  .countdown {
    display: flex;
    align-items: center;
    column-gap: 5px;
    font-size: 10px;
    font-weight: 300;
    color: #fff;
    width: 150px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background-color: rgba(0, 0, 0, 0.6);
    padding: 10px;
    justify-content: center;
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
  text-shadow: 1px 0px 1px ${ctaColor()}, 0px 1px 1px ${ctaColor()},
    1px 1px 1px ${ctaColor()}, -1px 0px 1px ${ctaColor()}, 0px -1px 1px ${ctaColor()},
    -1px -1px 1px ${ctaColor()};
  box-shadow: 0px 0px 15px 0px red;
  transition: all ease 0.2s;
  &:hover {
    background-color: ${ctaColor(100)};
  }
`;

export { AppWrapper, Container, Row, Column, ctaColor, GlobalStyle }