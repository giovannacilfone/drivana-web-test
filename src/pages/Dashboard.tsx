import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Reservations from "./Reservations";
import styled from "styled-components";
import Documents from "./Documents";
import NavBar from "./NavBar";
import { FaFileAlt } from "react-icons/fa";
import { TitleWelcome } from "../ui/Text";
import { ButtonRedirect } from "../ui/CustomButtons";

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 5rem;
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);
  const [showDocuments, setShowDocuments] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserName(parsedUser.name);
    } else {
      navigate("/");
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const toggleView = () => {
    setShowDocuments(!showDocuments);
  };

  if (isLoading) return null;
  return (
    <div>
      <NavBar name={userName || ""} handleLogout={handleLogout} />
      <TitleWelcome>¡Welcome {userName}!</TitleWelcome>
      <ButtonContainer>
        <ButtonRedirect onClick={toggleView}>
          <FaFileAlt />
          {showDocuments ? "Reservations" : "Documents"}
        </ButtonRedirect>
      </ButtonContainer>
      {showDocuments ? <Documents /> : <Reservations />}
    </div>
  );
};

export default Dashboard;
