import styled from "styled-components";

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
