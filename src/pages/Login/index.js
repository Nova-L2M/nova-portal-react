import styled from 'styled-components';
import { AppWrapper, Container, Row, Column } from '../../App'
import { useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";

const Login = (props) => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const { login, error, isPending } = useLogin();

    useEffect(() => {
        if (token) {
          console.log(token)
          login(token);
        }
    }, [token, login]);
    
    return (
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
                    <LoginButton href="https://us-central1-nova-tools-app.cloudfunctions.net/api/login/nova_website_dev">
                      {isPending ? "Loading..." : "Login With Discord"}
                    </LoginButton>
                  </LoginWrapper>
                </Column>
              </Row>
            </Container>
          </AppWrapper>
    );
}
const LoginWrapper = styled.div`
    width: 100%;
    max-width: 400px;
    background-color: rgb(0 0 0 / 30%);
    min-height: 100px;
    border: 1px solid rgb(255 255 255 / 30%);
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    padding: 30px;
    row-gap: 15px;
    & h1 {
        width: 100%;
        text-align: center;
        text-transform: uppercase;
        font-size: 24px;
    }
    & p {
        width: 100%;
        font-size: 14px;
        text-align: center;
    }
`;
const LoginButton = styled.a`
    padding: 10px 20px;
    cursor: pointer;
    outline: none;
    border-radius: 999px;
    color: #fff;
    font-weight: 200;
    text-transform: uppercase;
    box-shadow: 0px 0px 15px 0px red;
    transition: all ease 0.2s;
    background-color: rgb(199 96 46 / 80%);
    border: 1px solid rgb(199 96 46 / 100%);
    text-decoration: none;
    display: flex;
    justify-content: center;
    align-items: center;
    &:focus {
        outline: none;
    }
    &:hover {
      background: rgb(199 96 46 / 100%);
    }
`;

export default Login;