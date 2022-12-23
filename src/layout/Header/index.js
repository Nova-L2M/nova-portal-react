import styled from 'styled-components';

const Header = () => {
  return (
    <HeaderWrapper>
      <TopHeader></TopHeader>
      <BottomHeader></BottomHeader>
    </HeaderWrapper>
  );
}
const HeaderWrapper = styled.header`
    display: flex;
    flex-direction: column;
`
const TopHeader = styled.div`
`
const BottomHeader = styled.div`
`
export default Header;