import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Reservations from "./Reservations";
import styled from "styled-components";
import Documents from "./Documents";
import NavBar from "./NavBar";
import { FaFileAlt } from "react-icons/fa";

const Title = styled.h1`
  color: #3600e0;
  font-size: 40px;
  margin-left: 100px;
  font-family: "Poppins", sans-serif;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 5rem;
`;

export const Button = styled.button`
  background-color: #ffff;
  color: #3600e0;
  border: 2px solid #3600e0;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 16px;
  font-family: "Poppins", sans-serif;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: background-color 0.4s ease, color 0.4s ease;
  &:hover {
    background-color: #2a00b3;
    color: white;
  }
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);
  const [showDocuments, setShowDocuments] = useState<boolean>(false);

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");

  useEffect(() => {
    if (loggedInUser) {
      setUserName(loggedInUser.name);
    }

    if (!loggedInUser) {
      navigate("/");
    }
  }, [loggedInUser]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const toggleView = () => {
    setShowDocuments(!showDocuments);
  };

  return (
    <div>
      <NavBar name={userName || ""} handleLogout={handleLogout} />
      <Title>¡Welcome {userName}!</Title>
      <ButtonContainer>
        <Button onClick={toggleView}>
          <FaFileAlt />
          {showDocuments ? "Reservations" : "Documents"}
        </Button>
      </ButtonContainer>
      {showDocuments ? <Documents /> : <Reservations />}
    </div>
  );
};

export default Dashboard;
