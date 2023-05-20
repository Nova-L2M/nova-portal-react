import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "./contexts/AuthContext";
import {
  Routes,
  Route
} from "react-router-dom";
import bgImg from "./images/background.jpeg";
import spinner from "./images/loading-spinner.svg";
import Bosses from "./pages/Bosses";
import Login from "./pages/Login";
import { db } from "./firebase/config";
import Header from "./layout/Header";
import { doc, getDoc } from "firebase/firestore";

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

function AuthenticatedApp(props) {
  // takes props.user and use it to get user data from firestore
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getUserData = async () => {
      const docRef = doc(db, "users", props.user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        debugger
        setUser(docSnap.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    };
    getUserData();
  }, [props.user.uid]);

  return user ? (
    <AppWrapper>
      <GlobalStyle />
      <Routes>
        <Route exact path="/" element={
          <>
              <Header user={user}/>
              <Bosses user={user}/>
          </>
        } />
      </Routes>
    </AppWrapper>
  ) : (
    <Loading />
  );
}

function UnauthenticatedApp() {
  return (
    <Routes>
      <Route exact path="/" element={
        <>
          <GlobalStyle />
          <Login />
        </>
      } />
    </Routes>
  );
}
const ctaColor = (opacity) => {
  return `rgb(255 103 0${opacity ? ` / ${opacity}%` : ""})`;
};
const burnColors = [
  '#f2c9fe66', 
  '#ee85fe66', 
  '#ae34ff66', 
  '#d80cec66',
  '#6c06cd66', 
  '#5e169766', 
  '#2a0e4566'
];
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    color: #fff;
    margin: 0;
    font-family:  "Noto Sans","Noto Sans JP","Noto Sans KR","Noto Sans Thai","Noto Sans Arabic",-apple-system,BlinkMacSystemFont,Roboto,Arial,"Microsoft YaHei","Microsoft JhengHei",sans-serif;
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
  .ui-timepicker-wrapper {
    overflow-y: auto;
    max-height: 150px;
    width: 219px;
    color: #fff;
    background: rgb(18 12 7 / 90%);
    border: 1px solid rgb(0 0 0 / 80%);
    box-shadow: 0 5px 10px rgb(0 0 0 / 20%);
    outline: none;
    z-index: 10052;
    margin: 0;
  }
  .ui-timepicker-list li {
    color:#fff;
    font-size: 12px;
  }

  li.ui-timepicker-selected, .ui-timepicker-list li:hover, .ui-timepicker-list .ui-timepicker-selected:hover {
    background: rgb(199 96 46);
    color: #fff;
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
    width: 200px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background-color: rgba(0, 0, 0, 0.6);
    padding: 10px;
    justify-content: center;
  }
  .fire {
    animation: burn 1.5s linear infinite alternate;
  }
  @keyframes burn {
    from { 
      box-shadow: -.1em 0 .3em ${burnColors[0]}, 
                  .1em -.1em .3em ${burnColors[1]}, 
                  -.2em -.2em .4em ${burnColors[2]}, 
                  .2em -.3em .3em ${burnColors[3]},
                   -.2em -.4em .4em ${burnColors[4]}, 
                   .1em -.5em .7em ${burnColors[5]}, 
                   .1em -.7em .7em ${burnColors[6]}; 
    }
    45%  { 
      box-shadow: .1em -.2em .5em ${burnColors[0]}, 
                  .15em 0 .4em ${burnColors[1]}, 
                  -.1em -.25em .5em ${burnColors[2]}, 
                  .15em -.45em .5em ${burnColors[3]}, 
                  -.1em -.5em .6em ${burnColors[4]}, 
                  0 -.8em .6em ${burnColors[5]}, 
                  .2em -1em .8em ${burnColors[6]}; 
    }
    70%  { 
      box-shadow: -.1em 0 .3em ${burnColors[0]}, 
                  .1em -.1em .3em ${burnColors[1]}, 
                  -.2em -.2em .6em ${burnColors[2]}, 
                  .2em -.3em .4em ${burnColors[3]}, 
                  -.2em -.4em .7em ${burnColors[4]}, 
                  .1em -.5em .7em ${burnColors[5]}, 
                  .1em -.7em .9em ${burnColors[6]}; 
    }
    to   { 
      box-shadow: -.1em -.2em .6em ${burnColors[0]}, 
                  -.15em 0 .6em ${burnColors[1]}, 
                  .1em -.25em .6em ${burnColors[2]}, 
                  -.15em -.45em .5em ${burnColors[3]}, 
                  .1em -.5em .6em ${burnColors[4]}, 
                  0 -.8em .6em ${burnColors[5]}, 
                  -.2em -1em .8em ${burnColors[6]}; 
    }
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
  background-attachment: fixed;
  padding: 90px 0 75px 0;
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