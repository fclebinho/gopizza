import { MaterialIcons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Alert, FlatList, TouchableOpacity } from "react-native";
import { useTheme } from "styled-components/native";

import {
  Container,
  Header,
  Greeting,
  GreetingEmoji,
  GreetingText,
  MenuHeader,
  MenuItemsNumber,
  Title,
  CreateProductButton,
} from "./style";

import happyEmoji from "@/assets/happy.png";
import { ProductCard, SearchPrice } from "@/components";
import { ProductProps } from "@/components/product-card";
import { useAuth } from "@/hooks";

const Home = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation();
  const { COLORS } = useTheme();
  const [pizzas, setPizzas] = useState<ProductProps[]>([]);
  const [search, setSearch] = useState("");

  const handleSignOut = () => signOut();

  const fetchPizzas = async (value: string) => {
    const formattedValue = value.toLocaleLowerCase().trim();

    firestore()
      .collection("pizzas")
      .orderBy("name_insentive")
      .startAt(formattedValue)
      .endAt(`${formattedValue}\uf8ff`)
      .get()
      .then((response) => {
        const data = response.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ProductProps[];

        setPizzas(data);
      })
      .catch(() => Alert.alert("Consula", "Não foi possível efetuar a consulta."));
  };

  const handleSearch = () => fetchPizzas(search);

  const handleSearchClear = () => {
    setSearch("");
    fetchPizzas("");
  };

  const handleOpenProduct = (id: string) => {
    const route = user?.isAdmin ? "product" : "order";

    navigation.navigate(route, { id });
  };

  const handleCreateProduct = () => navigation.navigate("product", {});

  useFocusEffect(
    useCallback(() => {
      fetchPizzas("");
    }, [])
  );

  return (
    <Container>
      <Header>
        <Greeting>
          <GreetingEmoji source={happyEmoji} />
          <GreetingText>Olá, Admin</GreetingText>
        </Greeting>
        <TouchableOpacity onPress={handleSignOut}>
          <MaterialIcons name="logout" size={24} color={COLORS.TITLE} />
        </TouchableOpacity>
      </Header>

      <SearchPrice
        onChangeText={setSearch}
        value={search}
        onClear={handleSearchClear}
        onSearch={handleSearch}
      />

      <MenuHeader>
        <Title>Cardápio</Title>
        <MenuItemsNumber>{`${pizzas.length} pizzas`}</MenuItemsNumber>
      </MenuHeader>

      <FlatList
        data={pizzas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard data={item} onPress={() => handleOpenProduct(item.id)} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 125,
          marginHorizontal: 24,
        }}
      />
      {user?.isAdmin && (
        <CreateProductButton
          title="Cadastrar pizza"
          type="secondary"
          onPress={handleCreateProduct}
        />
      )}
    </Container>
  );
};

export default Home;
