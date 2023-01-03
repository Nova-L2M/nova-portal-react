import styled from 'styled-components';
import LogoImg from '../../images/lineage2m-logo.png';
import { useState, useEffect } from 'react';
import { useLogout } from '../../hooks/useLogout';


const Header = (props) => {
  const { logout } = useLogout();
  //set state for user menu open and close
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  let user = props.user;
  console.log(user);
  let discordAvatar = `https://cdn.discordapp.com/avatars/${user.uid}/${user.avatar}.png`;
  useEffect(() => {
    if (userMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }
  , [userMenuOpen]);
  return (
    <HeaderWrapper>
      <TopHeader>
        <HamburgerMenu>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" id="line2"></line>
            <line x1="3" y1="6" x2="21" y2="6" id="line1"></line>
            <line x1="3" y1="18" x2="21" y2="18" id="line3"></line>
          </svg>
        </HamburgerMenu>
        <Logo src={LogoImg} alt="Nova Logo" />
        <Spacer />
        <UserMenuWrapper 
          onClick={() => setUserMenuOpen(!userMenuOpen)}
        > 
          <AvatarWrapper>
            <Avatar src={discordAvatar} alt="User Avatar" />
          </AvatarWrapper>
          <Username>{user.username}</Username>
        </UserMenuWrapper>
      </TopHeader>
      {/* <BottomHeader></BottomHeader> */}
      <UserMenuContainer className={userMenuOpen ? "open" : ""}>
        <UserMenuBG 
          className={userMenuOpen ? "open" : ""}
          onClick={() => setUserMenuOpen(!userMenuOpen)}
        ></UserMenuBG>
        <UserMenu className={userMenuOpen ? "open" : ""}>
          <UserMenuTop
            style={{backgroundImage: `url(${discordAvatar})`}}
          >
            <UserMenuClose
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </UserMenuClose>
            <UserMenuTop1>
              <AvatarWrapper className="big">
                <Avatar src={discordAvatar} alt="User Avatar" />
              </AvatarWrapper>
              <Username>{user.username}</Username>
              <LogoutLink onClick = {logout}>
                Logout
              </LogoutLink>
            </UserMenuTop1>
            <UserMenuTop2></UserMenuTop2>
          </UserMenuTop>
        </UserMenu>
      </UserMenuContainer>
    </HeaderWrapper>
  );
  // prevent body from scrolling when user menu is open
}
const HeaderWrapper = styled.header`
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background-color: rgb( 0 0 0 / 50% );
`
const TopHeader = styled.div`
  height: 57px;
  border-bottom: 1px solid rgb(255 255 255 / 10%);
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 20px;
`
const BottomHeader = styled.div`
  height: 57px;
  padding: 0 20px;
`
const Logo = styled.img`
  width: 100px;
`
const HamburgerMenu = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(255 255 255 / 50%);
  cursor: pointer;
  svg {
    width: 100%;
    height: 100%;
    transition: all ease 0.2s;
    #line1, #line2, #line3 {
      transform-origin: center center;
      transform: rotate(0deg);
      transition: all ease 0.2s;
    }

  }
  // animate hamburger menu into arrow on hover
  &:hover {
    color: rgb(255 255 255 / 100%);
    svg #line1 {
      transform: translate3d(1px,0,0) rotate(45deg) scaleX(.6);
    }
    svg #line2 {
      transform: rotate(180deg);
    }
    svg #line3 {
      transform: translate3d(1px,0,0) rotate(-45deg) scaleX(.6);
    }
  }
`
const Spacer = styled.div`
  flex: 1;
`
const AvatarWrapper = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 9999px;
  background-color: rgb(255 255 255 / 10%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(255 255 255 / 50%);
  cursor: pointer;
  transition: all ease 0.2s;
  border: 1px solid rgb(246 202 130 / 80%);
  &:hover {
    color: rgb(255 255 255 / 100%);
    background-color: rgb(255 255 255 / 20%);
    border: 1px solid rgb(246 202 130 / 100%);
  }
  &.big {
    width: 60px;
    height: 60px;
    cursor: default;
  }
`
const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  object-fit: cover;
`
const Username = styled.div`
  color: rgb(255 255 255 / 100%);
  font-size: 14px;
  font-weight: 500;
  margin-left: -5px;
`
const UserMenuWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: 10px;
  cursor: pointer;
`
const UserMenuContainer = styled.div`
  position: fixed;
  top: 0;
  right: -100%;
  width: 100%;
  height: 100vh;
  background-color: transparent;
  z-index: 999;
  &.open {
    right: 0;
  }
`
const UserMenuBG = styled.div`
  position: fixed;
  top: 0;
  right: -100%;
  width: 100%;
  height: 100vh;
  background-color: rgb(0 0 0 / 60%);
  opacity: 0;
  transition: opacity ease 0.2s;
  &.open {
    right: 0;
    opacity: 1;
  }
`
const UserMenu = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background-color: rgb(255 255 255 / 100%);
  transform: translate3d(100%,0,0);
  transition: all ease 0.2s;
  z-index: 999;
  &.open {
    transform: translate3d(0,0,0);
  }
`
const UserMenuTop = styled.div`
  height: 250px;
  background-color: #CE631E;
  display: flex;
  flex-direction: column;
  position: relative;
  background-size:cover;
`
const UserMenuClose = styled.div`
  width: 30px;
  height: 30px;
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(255 255 255 / 100%);
  cursor: pointer;
  svg {
    width: 100%;
    height: 100%;
  }
`
const UserMenuTop1 = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  column-gap: 10px;
  background-color: rgb(206 99 30 / 80%);
`
const UserMenuTop2 = styled.div`
  flex: 0 1 auto;
`
const LogoutLink = styled.div`
  color: rgb(255 255 255 / 100%);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all ease 0.2s;
  position: absolute;
  top: 20px;
  left: 20px;
  &:hover {
    color: rgb(255 255 255 / 80%);
  }
`

export default Header;