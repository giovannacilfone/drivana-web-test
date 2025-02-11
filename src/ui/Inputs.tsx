import styled from "styled-components";

export const InputLogin = styled.input`
  width: 80%;
  padding: 10px;
  border: 2px solid #3600e0;
  border-radius: 6px;
  font-size: 16px;
  margin-bottom: 15px;
  margin-left: 40px;
`;

export const FileInput = styled.input`
  display: none;
`;

export const SignInLink = styled.a`
  display: block;
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
  color: #3c09e0;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
