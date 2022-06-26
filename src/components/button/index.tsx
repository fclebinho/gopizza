import React from "react";
import { RectButtonProps } from "react-native-gesture-handler";

import { Container, TypeProps, Loader, Title } from "./style";

type Props = RectButtonProps & {
  title: string;
  type?: TypeProps;
  loading?: boolean;
};

const Button = ({ title, type = "primary", loading = false, ...rest }: Props) => {
  return (
    <Container type={type} enabled={!loading} {...rest}>
      {loading ? <Loader /> : <Title>{title}</Title>}
    </Container>
  );
};

export default Button;
