import { Outlet, useNavigate } from "react-router-dom";
import {
  Container,
  StyledSideMenu,
  UserContainer,
  UserImage,
  UserIdAndName,
  StyledMenuList,
  StyledMenuItem,
  MenuIcon,
  StyledLink,
  Dummy,
} from "../style/LayoutStyle";
import { useState, useContext, useEffect } from "react";
import { GiHamburgerMenu, GiCancel } from "react-icons/gi";
import { FiSettings } from "react-icons/fi";
import { FaHome, FaClipboardList } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { UserContext } from "../context/UserStore";
import AxiosApi from "../api/AxiosApi";

const Layout = ({ openAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { color, loginUser, handleLogout } = useContext(UserContext);
  const [member, setMember] = useState(null);

  // 로그인 유저 정보 조회
  useEffect(() => {
    if (!loginUser) {
      openAuth();
      return;
    }

    const getMember = async () => {
      try {
        const rsp = await AxiosApi.getUser(loginUser.userId);
        if (rsp.data.success) {
          setMember(rsp.data.data);
        }
      } catch (e) {
        console.log(e);
      }
    };

    getMember();
  }, [loginUser, openAuth]);

  const onClickLeft = () => setIsMenuOpen(!isMenuOpen);

  const onClickSetting = () => {
    navigate("/themeSetting");
    setIsMenuOpen(false);
  };

  const onClickLogout = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <Container color={color}>
      <header className="mainhead">
        <div className="hambeger">
          {isMenuOpen ? (
            <GiCancel size={32} color="white" onClick={onClickLeft} />
          ) : (
            <GiHamburgerMenu size={32} color="white" onClick={onClickLeft} />
          )}
        </div>
        <div className="setting">
          <FiSettings size={32} color="white" onClick={onClickSetting} />
        </div>

        <StyledSideMenu
          isOpen={isMenuOpen}
          onClick={() => setIsMenuOpen(false)}
        >
          <StyledMenuList>
            {/* 회원 정보 */}
            <UserContainer>
              <UserImage src={"http://via.placeholder.com/50"} alt="User" />
              <UserIdAndName>
                <span>{member?.name || loginUser?.name}</span>
                <span style={{ fontSize: "12px", color: "#999999" }}>
                  {member?.email || loginUser?.email}
                </span>
              </UserIdAndName>
            </UserContainer>

            {/* 메뉴 */}
            <StyledMenuItem>
              <MenuIcon>
                <FaHome />
              </MenuIcon>
              <StyledLink to="/home">Home</StyledLink>
            </StyledMenuItem>

            <StyledMenuItem>
              <MenuIcon>
                <FaClipboardList />
              </MenuIcon>
              <StyledLink to="/boards">Boards</StyledLink>
            </StyledMenuItem>

            <StyledMenuItem>
              <MenuIcon>
                <CgProfile />
              </MenuIcon>
              <StyledLink to="/members">Members</StyledLink>
            </StyledMenuItem>

            {/* 로그아웃 */}
            <StyledMenuItem
              style={{ cursor: "pointer", color: "#E53E3E" }}
              onClick={onClickLogout}
            >
              <MenuIcon>🚪</MenuIcon>
              <span>Logout</span>
            </StyledMenuItem>
          </StyledMenuList>
        </StyledSideMenu>
      </header>

      <main>
        <Dummy />
        <Outlet />
      </main>
    </Container>
  );
};

export default Layout;
