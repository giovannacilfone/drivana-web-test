import styled from "styled-components";
import logo from "../assets/drivanaLogo.png";
import { FaUserCircle } from "react-icons/fa";
import { LogoNav } from "../ui/Images";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const AccountIcon = styled(FaUserCircle)`
  color: #3600e0;
  font-size: 32px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

interface NavBarProps {
  handleLogout: () => void;
  name: string;
}

const NavBar = ({ handleLogout, name }: NavBarProps) => {
  return (
    <Container>
      <LogoNav src={logo} alt="Company Logo" />
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginRight: "20px" }}>
        <AccountIcon onClick={handleLogout} />
        <p>{name}</p>
      </div>
    </Container>
  );
};

export default NavBar;
