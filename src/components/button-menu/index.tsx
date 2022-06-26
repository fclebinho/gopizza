import React from "react";
import { Text } from "react-native";

import { Container, Title, Notification, Quantity } from "./style";

type Props = {
  title: string;
  color: string;
  notification?: string | undefined;
};

const ButtonMenu = ({ title, color, notification }: Props) => {
  const noNotification = notification === "0";
  return (
    <Container>
      <Title color={color}>{title}</Title>

      {notification && (
        <Notification noNotification={noNotification}>
          <Quantity noNotification={noNotification}>{notification}</Quantity>
        </Notification>
      )}
    </Container>
  );
};

export default ButtonMenu;
