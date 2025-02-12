import React from "react";
import { useForm, FieldValues, FieldError } from "react-hook-form";
import styled from "styled-components";
import drivanaLogin from "../assets/drivanaLogin.jpg";
import logo from "../assets/drivanaLogo.png";
import { toast } from "react-toastify";
import { API_URL } from "../main";
import { TitleLogin } from "../ui/Text";
import { ButtonLogin } from "../ui/CustomButtons";
import { ImageContainer, Logo } from "../ui/Images";
import { InputLogin, SignInLink } from "../ui/Inputs";

const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const FormContainer = styled.div`
  flex: 1;
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

const Form = styled.form`
  width: 80%;
  max-width: 400px;
  padding: 30px;
  border-radius: 8px;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const InputRow = styled.div`
  display: flex;
`;

const SmallInput = styled(InputLogin)`
  width: 120px;
`;

export const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  margin-bottom: 5px;
  margin-top: 0;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 80%;
  margin-left: 40px;
`;

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FieldValues>();

  const onSubmit = async (data: FieldValues) => {
    try {
      const response = await fetch(`${API_URL}/users?email=${data.email}`);
      const existingUsers = await response.json();

      if (existingUsers.length > 0) {
        toast.error("Email already registered!");
        return;
      }

      const newUser = { ...data };

      const createdUserResponse = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const createdUser = await createdUserResponse.json();

      const existingUsersInStorage = JSON.parse(localStorage.getItem("users") || "[]");

      const updatedUsers = [...existingUsersInStorage, createdUser];

      localStorage.setItem("users", JSON.stringify(updatedUsers));

      toast.success("Account created successfully!");
      window.location.href = "/dashboard";
    } catch (error) {
      toast.error("Error registering account!");
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
          <TitleLogin>Create Account</TitleLogin>

          <InputRow>
            <InputGroup>
              <SmallInput
                {...register("name", { required: "Name is required" })}
                placeholder="Name"
              />
              {errors.name && <ErrorMessage>{(errors.name as FieldError).message}</ErrorMessage>}
            </InputGroup>
            <InputGroup>
              <SmallInput
                {...register("phone", { required: "Phone number is required" })}
                placeholder="Phone"
              />
              {errors.phone && <ErrorMessage>{(errors.phone as FieldError).message}</ErrorMessage>}
            </InputGroup>
          </InputRow>

          <InputGroup>
            <InputLogin
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Enter a valid email address",
                },
              })}
              placeholder="Email"
            />
            {errors.email && <ErrorMessage>{(errors.email as FieldError).message}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <InputLogin
              {...register("password", { required: "Password is required" })}
              placeholder="Password"
              type="password"
            />
            {errors.password && (
              <ErrorMessage>{(errors.password as FieldError).message}</ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <InputLogin
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) => value === watch("password") || "Passwords do not match",
              })}
              placeholder="Confirm Password"
              type="password"
            />
            {errors.confirmPassword && (
              <ErrorMessage>{(errors.confirmPassword as FieldError).message}</ErrorMessage>
            )}
          </InputGroup>

          <ButtonLogin type="submit">Create Account</ButtonLogin>
          <SignInLink href="/">Already have an account? Sign in</SignInLink>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default Register;
