import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text } from "react-native";
import { RectButtonProps } from "react-native-gesture-handler";
import { useTheme } from "styled-components/native";

import {
  Container,
  Content,
  Image,
  Details,
  Name,
  Description,
  Line,
  Identification,
} from "./style";

export type ProductProps = {
  id: string;
  photo_url: string;
  name: string;
  description: string;
};

type Props = RectButtonProps & {
  data: ProductProps;
};

const ProductCard = ({ data, ...rest }: Props) => {
  const { COLORS } = useTheme();

  return (
    <Container>
      <Content {...rest}>
        <Image source={{ uri: data.photo_url }} />
        <Details>
          <Identification>
            <Name>{data.name}</Name>
            <Feather name="chevron-right" size={18} color={COLORS.TITLE} />
          </Identification>
          <Description>{data.description}</Description>
        </Details>
      </Content>
      <Line />
    </Container>
  );
};

export default ProductCard;
