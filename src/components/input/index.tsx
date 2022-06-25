import React from "react";
import { TextInputProps } from "react-native";

import { Container, TypeProps } from "./style";

type Props = TextInputProps & {
  type?: TypeProps;
};

const Input = ({ type = "primary", ...rest }: Props) => {
  return <Container type={type} {...rest} />;
};

export default Input;
