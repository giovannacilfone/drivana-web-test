import React from "react";
import { useForm, FieldValues, FieldError } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import drivanaLogin from "../assets/drivanaLogin.jpg";
import logo from "../assets/drivanaLogo.png";
import { toast } from "react-toastify";
import { SignInLink } from "./Register";

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const ImageContainer = styled.img`
  flex: 1;
  width: 50%;
  height: 100%;
  object-fit: cover;
`;

const FormContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

const Form = styled.form`
  width: 80%;
  max-width: 400px;
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

export const Logo = styled.img`
  width: 160px;
  height: auto;
  margin-bottom: 60px;
`;

const Title = styled.h1`
  text-align: center;
  color: #000;
  font-size: 18px;
  margin-bottom: 60px;
  margin-left: 20px;
  font-family: "Inter", sans-serif;
`;

const Input = styled.input`
  width: 80%;
  padding: 10px;
  border: 2px solid #3600e0;
  border-radius: 6px;
  font-size: 16px;
  margin-bottom: 15px;
  margin-left: 40px;
`;

export const Button = styled.button`
  margin-top: 20px;
  width: 80%;
  padding: 12px;
  background-color: #3600e0;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  margin-left: 50px;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  text-align: center;
`;

const fetchUserFromLocalStorage = (email: string, password: string) => {
  const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
  return (
    storedUsers.find((user: any) => user.email === email && user.password === password) || null
  );
};
const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>();

  const navigate = useNavigate();

  const onSubmit = async (data: FieldValues) => {
    const { email, password } = data;
    const user = fetchUserFromLocalStorage(email, password);

    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      toast.success("Login successful!");
      navigate("/dashboard");
    } else {
      toast.error("Invalid email or password.");
    }
  };

  return (
    <Container>
      <ImageContainer src={drivanaLogin} alt="background image" />

      <FormContainer>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <LogoContainer>
            <Logo src={logo} alt="Company Logo" />
          </LogoContainer>
          <Title>Log in to your account</Title>

          <Input
            {...register("email", { required: "Email is required" })}
            placeholder="Email"
            type="email"
          />
          {errors.email && <ErrorMessage>{(errors.email as FieldError).message}</ErrorMessage>}

          <Input
            {...register("password", { required: "Password is required" })}
            placeholder="Password"
            type="password"
          />
          {errors.password && (
            <ErrorMessage>{(errors.password as FieldError).message}</ErrorMessage>
          )}

          <Button type="submit">Sign In</Button>
          <SignInLink href="/register">Don't have an account? Sign up</SignInLink>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default Login;
