import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacityProps } from "react-native";
import { useTheme } from "styled-components";

import { Container } from "./style";

const ButtonBack = ({ ...rest }: TouchableOpacityProps) => {
  const { COLORS } = useTheme();

  return (
    <Container {...rest}>
      <MaterialIcons name="chevron-left" size={18} color={COLORS.TITLE} />
    </Container>
  );
};

export default ButtonBack;
