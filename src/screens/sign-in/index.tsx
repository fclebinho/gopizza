import React, { useState } from "react";
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
import { useAuth } from "@/hooks";

const SignIn = () => {
  const { signIn, forgotPassword, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    signIn(email, password);
  };

  const handleForgotPassword = () => {
    forgotPassword(email);
  };

  return (
    <Container>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Content>
          <Brand source={logo} />
          <Title>Login</Title>
          <Input
            placeholder="E-mail"
            type="secondary"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={setEmail}
          />
          <Input placeholder="Senha" type="secondary" secureTextEntry onChangeText={setPassword} />
          <ForgetPasswordButton onPress={handleForgotPassword}>
            <ForgetPasswordLabel>Esqueci minha senha</ForgetPasswordLabel>
          </ForgetPasswordButton>
          <Button
            title="Entrar"
            type="secondary"
            onPress={() => handleSignIn()}
            loading={loading}
          />
        </Content>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default SignIn;
