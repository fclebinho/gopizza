import firestore from "@react-native-firebase/firestore";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";

import {
  Container,
  Content,
  Header,
  Photo,
  Sizes,
  Form,
  Title,
  Label,
  InputGroup,
  FormRow,
  PriceLabel,
} from "./style";

import { OrderNavigationProps } from "@/@types/navigation";
import { Button, ButtonBack, Input, RadioButton } from "@/components";
import { ProductProps } from "@/components/product-card";
import { useAuth } from "@/hooks";
import { PIZZA_TYPES } from "@/uitls";

type PizzaResponse = ProductProps & {
  price_sizes: {
    [key: string]: number;
  };
};

const Order = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { id } = route.params as OrderNavigationProps;

  const [size, setSize] = useState("");
  const [pizza, setPizza] = useState<PizzaResponse>({} as PizzaResponse);
  const [quantity, setQuantity] = useState(1);
  const [table, setTable] = useState("");
  const [sendingOrder, setSendingOrder] = useState(false);

  const amount = size ? pizza.price_sizes[size] * quantity : 0;

  const handleGoBack = () => navigation.goBack();

  const handleCreateOrder = async () => {
    if (!size) {
      return Alert.alert("Pedido", "Selecione o tamanho da pizza.");
    }

    if (!table) {
      return Alert.alert("Pedido", "Informe o número da mesa.");
    }

    if (!table) {
      return Alert.alert("Pedido", "Informe a quantidade.");
    }

    setSendingOrder(true);

    firestore()
      .collection("orders")
      .add({
        quantity,
        amount,
        pizza: pizza.name,
        size,
        table_number: table,
        status: "Preparando",
        waiter_id: user?.id,
        image: pizza.photo_url,
      })
      .then(() => navigation.navigate("home"))
      .catch(() => {
        Alert.alert("Pedido", "Não foi possível realizar esse pedido.");
        setSendingOrder(false);
      });
  };

  useEffect(() => {
    if (id) {
      firestore()
        .collection("pizzas")
        .doc(id)
        .get()
        .then((response) => {
          const data = response.data() as PizzaResponse;

          setPizza(data);
        })
        .catch(() => Alert.alert("Pedido", "Não foi possível realizar o pedido."));
    }
  }, []);

  return (
    <Container behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Content>
        <Header>
          <ButtonBack onPress={handleGoBack} style={{ marginBottom: 108 }} />
        </Header>
        <Photo
          source={{
            uri: pizza.photo_url,
          }}
        />

        <Form>
          <Title>{pizza.name}</Title>
          <Label>Selecione o tamanho</Label>
          <Sizes>
            {PIZZA_TYPES.map((e) => (
              <RadioButton
                key={e.id}
                title={e.name}
                selected={size === e.id}
                onPress={() => setSize(e.id)}
              />
            ))}
          </Sizes>

          <FormRow>
            <InputGroup>
              <Label>Número da mesa</Label>
              <Input keyboardType="numeric" onChangeText={setTable} value={table} />
            </InputGroup>
            <InputGroup>
              <Label>Quantidade</Label>
              <Input
                keyboardType="numeric"
                onChangeText={(value) => setQuantity(Number(value))}
                value={String(quantity)}
              />
            </InputGroup>
          </FormRow>

          <PriceLabel>Valor de R$ {amount}</PriceLabel>

          <Button title="Confirmar pedido" onPress={handleCreateOrder} loading={sendingOrder} />
        </Form>
      </Content>
    </Container>
  );
};

export default Order;
