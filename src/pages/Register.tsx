import React from "react";
import { useForm, FieldValues, FieldError } from "react-hook-form";
import styled from "styled-components";
import drivanaLogin from "../assets/drivanaLogin.jpg";
import logo from "../assets/drivanaLogo.png";
import { toast } from "react-toastify";
import { Logo } from "./Login";
import { API_URL } from "../main";

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

export const LogoNav = styled.img`
  width: auto;
  margin-left: 20px;
  height: 3rem;
`;

const Title = styled.h1`
  text-align: center;
  color: #000;
  font-size: 18px;
  font-family: "Inter", sans-serif;
  margin-bottom: 50px;
`;

const InputRow = styled.div`
  display: flex;
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

const SmallInput = styled(Input)`
  width: 120px;
  margin-right: 16px;
`;

const Button = styled.button`
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
          <Title>Create Account</Title>
          <InputRow>
            <SmallInput
              {...register("name", { required: "Name is required" })}
              placeholder="Name"
            />
            <SmallInput
              {...register("phone", { required: "Phone number is required" })}
              placeholder="Phone"
            />
          </InputRow>
          {errors.name && <p>{(errors.name as FieldError).message}</p>}
          {errors.phone && <p>{(errors.phone as FieldError).message}</p>}
          <Input {...register("email", { required: "Email is required" })} placeholder="Email" />
          {errors.email && <p>{(errors.email as FieldError).message}</p>}
          <Input
            {...register("password", { required: "Password is required" })}
            placeholder="Password"
            type="password"
          />
          {errors.password && <p>{(errors.password as FieldError).message}</p>}
          <Input
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) => value === watch("password") || "Passwords do not match",
            })}
            placeholder="Confirm Password"
            type="password"
          />
          {errors.confirmPassword && <p>{(errors.confirmPassword as FieldError).message}</p>}
          <Button type="submit">Create Account</Button>
          <SignInLink href="/">Already have an account? Sign in</SignInLink>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default Register;
