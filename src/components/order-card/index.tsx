import React from "react";
import { Text, TouchableOpacityProps } from "react-native";

import {
  Container,
  Image,
  Name,
  Description,
  StatusContainer,
  StatusLabel,
  StatusTypesProps,
} from "./style";

export type OrderProps = {
  id: string;
  pizza: string;
  image: string;
  status: StatusTypesProps;
  table_number: string;
  quantity: string;
};

type Props = TouchableOpacityProps & {
  index: number;
  data: OrderProps;
};

const OrderCard = ({ data, index, ...rest }: Props) => {
  return (
    <Container index={index} {...rest}>
      <Image source={{ uri: data.image }} />
      <Name>{data.pizza}</Name>
      <Description>
        Mesa {data.table_number} &#9679; Qtde {data.quantity}
      </Description>
      <StatusContainer status={data.status}>
        <StatusLabel status={data.status}>{data.status}</StatusLabel>
      </StatusContainer>
    </Container>
  );
};

export default OrderCard;
