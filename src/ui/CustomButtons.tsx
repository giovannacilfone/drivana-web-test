import styled from "styled-components";

interface ButtonProps {
  bgColor?: string;
  color?: string;
  hoverColor?: string;
}

export const CustomFileInputButton = styled.button`
  background-color: #fff;
  color: #3600e0;
  border: 2px solid #3600e0;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  &:hover {
    background-color: #2a00b3;
    color: #fff;
  }
`;

export const ButtonLogin = styled.button`
  margin-top: 20px;
  margin-left: 50px;
  width: 80%;
  padding: 12px;
  background-color: #3600e0;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
`;
export const ButtonModal = styled.button<ButtonProps>`
  background-color: ${(props) => props.bgColor || "#007bff"};
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  margin: 20px;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const ExtendButton = styled.button<ButtonProps>`
  background-color: ${(props) => props.bgColor || "#007bff"};
  color: ${(props) => props.color || "white"};
  border: none;
  padding: 6px 10px;
  border-radius: 5px;
  margin-top: 13px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;

  &:hover {
    background-color: ${(props) => props.hoverColor || "#0056b3"};
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
export const ButtonIcon = styled.button`
  background-color: #3600e0;
  color: white;
  border-radius: 20px;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  &:hover {
    background-color: #2a00b3;
  }
`;

export const ButtonRedirect = styled.button`
  background-color: #ffff;
  color: #3600e0;
  border: 2px solid #3600e0;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 16px;
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

export const ButtonSend = styled.button`
  background-color: #3600e0;
  color: white;
  font-weight: bold;
  border-radius: 20px;
  margin-right: 100px;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  margin-top: 20px;
  align-self: flex-end;

  &:hover {
    background-color: #2a00b3;
  }
`;
