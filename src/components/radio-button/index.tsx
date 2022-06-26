import React from "react";
import { TouchableOpacityProps } from "react-native";

import { Container, Title, Radio, Selected, RadioButtonProps } from "./style";

type Props = TouchableOpacityProps &
  RadioButtonProps & {
    title: string;
  };

const RadioButton = ({ title, selected = false, ...rest }: Props) => {
  return (
    <Container selected={selected} {...rest}>
      <Radio>{selected && <Selected />}</Radio>

      <Title>{title}</Title>
    </Container>
  );
};

export default RadioButton;
