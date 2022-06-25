import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";

import {
  Container,
  Content,
  Title,
  Brand,
  ForgetPasswordButton,
  ForgetPasswordLabel,
} from "./style";

import logo from "@/assets/brand.png";
import { Input, Button } from "@/components";

const SignIn = () => {
  return (
    <Container>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Content>
          <Brand source={logo} />
          <Title>Login</Title>
          <Input
            placeholder="E-mail"
            type="secondary"
            autoCorrect={false}
            autoCapitalize="none"
          />
          <Input placeholder="Senha" type="secondary" secureTextEntry />
          <ForgetPasswordButton>
            <ForgetPasswordLabel>Esqueci minha senha</ForgetPasswordLabel>
          </ForgetPasswordButton>
          <Button title="Entar" type="secondary" />
        </Content>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default SignIn;
