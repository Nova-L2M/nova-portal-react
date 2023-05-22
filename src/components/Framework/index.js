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
  &.grow {
    flex: 1 0 0;
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

export { AppWrapper, Container, Row, Column }