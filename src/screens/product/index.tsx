import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Platform, TouchableOpacity, Alert, ScrollView, View } from "react-native";

import {
  Container,
  Header,
  Title,
  DeleteLabel,
  Upload,
  PickImageButton,
  Form,
  Label,
  InputGroup,
  InputGroupHeader,
  MaxCharacters,
} from "./style";

import { ProductNavigationProps } from "@/@types/navigation";
import { ButtonBack, InputPrice, Photo, Input, Button } from "@/components";
import { ProductProps } from "@/components/product-card";

type ProductResponse = ProductProps & {
  photo_path: string;
  price_sizes: {
    small: string;
    medium: string;
    large: string;
  };
};

const Product = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceSizeP, setPriceSizeP] = useState("");
  const [priceSizeM, setPriceSizeM] = useState("");
  const [priceSizeG, setPriceSizeG] = useState("");
  const [photoPath, setPhotoPath] = useState("");
  const [loading, setLoading] = useState(false);

  const { id } = route.params as ProductNavigationProps;

  const handlePickerImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 4],
      });

      if (!result.cancelled) {
        setImage(result.uri);
      }
    }
  };

  const handleAdd = async () => {
    if (!name.trim()) {
      Alert.alert("Cadastro", "Informe o nome da pizza.");
    }

    if (!description.trim()) {
      Alert.alert("Cadastro", "Informe a descrição da pizza.");
    }

    if (!priceSizeP.trim() || !priceSizeM.trim() || !priceSizeG.trim()) {
      Alert.alert("Cadastro", "Informe os preços e todos tamanhos de pizza.");
    }

    setLoading(true);

    const fileName = new Date().getTime();
    const reference = storage().ref(`/pizzas/${fileName}.png`);

    await reference.putFile(image);
    const photo_url = await reference.getDownloadURL();

    await firestore()
      .collection("pizzas")
      .add({
        name,
        name_insentive: name.toLowerCase().trim(),
        description,
        price_sizes: {
          small: priceSizeP,
          medium: priceSizeM,
          large: priceSizeG,
        },
        photo_url,
        photo_path: reference.fullPath,
      })
      .then(() => navigation.navigate("home"))
      .catch(() => {
        Alert.alert("Cadastro", "Não foi possível cadastrar a pizza");
        setLoading(false);
      });
  };

  const handleGoBack = () => navigation.goBack();

  const handleDeleteProduct = () => {
    firestore()
      .collection("pizzas")
      .doc(id)
      .delete()
      .then(() => {
        storage()
          .ref(photoPath)
          .delete()
          .then(() => navigation.navigate("home"));
      });
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      firestore()
        .collection("pizzas")
        .doc(id)
        .get()
        .then((response) => {
          const product = response.data() as ProductResponse;

          setName(product.name);
          setDescription(product.description);
          setImage(product.photo_url);
          setPriceSizeP(product.price_sizes.small);
          setPriceSizeM(product.price_sizes.medium);
          setPriceSizeG(product.price_sizes.large);
          setPhotoPath(product.photo_path);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  return (
    <Container behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <ButtonBack onPress={handleGoBack} />
          <Title>Cadastrar</Title>
          {id ? (
            <TouchableOpacity onPress={handleDeleteProduct}>
              <DeleteLabel>Excluir</DeleteLabel>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 20 }} />
          )}
        </Header>
        <Upload>
          <Photo uri={image} />
          {!id && <PickImageButton title="Carregar" type="secondary" onPress={handlePickerImage} />}
        </Upload>
        <Form>
          <InputGroup>
            <Label>Nome</Label>
            <Input onChangeText={setName} value={name} />
          </InputGroup>
          <InputGroup>
            <InputGroupHeader>
              <Label>Descrição</Label>
              <MaxCharacters>0 de 60 caracteres</MaxCharacters>
            </InputGroupHeader>
            <Input
              multiline
              maxLength={60}
              style={{ height: 80 }}
              onChangeText={setDescription}
              value={description}
            />
          </InputGroup>
          <InputGroup>
            <Label>Tamanhos e preços</Label>
            <InputPrice size="P" onChangeText={setPriceSizeP} value={priceSizeP} />
            <InputPrice size="M" onChangeText={setPriceSizeM} value={priceSizeM} />
            <InputPrice size="G" onChangeText={setPriceSizeG} value={priceSizeG} />
          </InputGroup>

          {!id && (
            <Button
              title="Cadastrar pizza"
              enabled={!loading}
              onPress={handleAdd}
              loading={loading}
            />
          )}
        </Form>
      </ScrollView>
    </Container>
  );
};

export default Product;
