import React from "react";
import { useForm, FieldValues, FieldError } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import drivanaLogin from "../assets/drivanaLogin.jpg";
import logo from "../assets/drivanaLogo.png";
import { toast } from "react-toastify";
import { ErrorMessage, TitleLogin } from "../ui/Text";
import { ButtonLogin } from "../ui/CustomButtons";
import { ImageContainer, Logo } from "../ui/Images";
import { InputLogin, SignInLink } from "../ui/Inputs";

const Container = styled.div`
  display: flex;
  height: 100vh;
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
          <TitleLogin>Log in to your account</TitleLogin>

          <InputLogin
            {...register("email", { required: "Email is required" })}
            placeholder="Email"
            type="email"
          />
          {errors.email && <ErrorMessage>{(errors.email as FieldError).message}</ErrorMessage>}

          <InputLogin
            {...register("password", { required: "Password is required" })}
            placeholder="Password"
            type="password"
          />
          {errors.password && (
            <ErrorMessage>{(errors.password as FieldError).message}</ErrorMessage>
          )}

          <ButtonLogin type="submit">Sign In</ButtonLogin>
          <SignInLink href="/register">Don't have an account? Sign up</SignInLink>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default Login;
