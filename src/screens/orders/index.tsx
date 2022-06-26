import firestore from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";

import { Container, Header, Title } from "./style";

import { ItemSeparator, OrderCard } from "@/components";
import { OrderProps } from "@/components/order-card";
import { useAuth } from "@/hooks";

const Orders = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState<OrderProps[]>([]);

  const handleDelivered = (order_id: string) => {
    Alert.alert("Pedido", "Confirmar entrega?", [
      {
        text: "Não",
        style: "cancel",
      },
      {
        text: "Sim",
        onPress: () => {
          firestore().collection("orders").doc(order_id).update({ status: "Entregue" });
        },
      },
    ]);
  };

  useEffect(() => {
    const subscribe = firestore()
      .collection("orders")
      .where("waiter_id", "==", user?.id)
      .onSnapshot((query) => {
        const data = query.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as OrderProps[];

        setOrders(data);
      });

    return () => subscribe();
  }, []);

  return (
    <Container>
      <Header>
        <Title>Pedidos feitos</Title>
      </Header>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <OrderCard
            index={index}
            data={item}
            disabled={item.status === "Entregue"}
            onPress={() => handleDelivered(item.id)}
          />
        )}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 125 }}
        ItemSeparatorComponent={() => <ItemSeparator />}
      />
    </Container>
  );
};

export default Orders;
