import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TextInputProps } from "react-native";
import { useTheme } from "styled-components/native";

import { Container, InputArea, Input, ButtonClear, Button } from "./style";

type Props = TextInputProps & {
  onSearch: () => void;
  onClear: () => void;
};

const Search = ({ onSearch, onClear, ...rest }: Props) => {
  const { COLORS } = useTheme();

  return (
    <Container>
      <InputArea>
        <Input placeholder="pesquisar..." {...rest} />

        <ButtonClear onPress={onClear}>
          <Feather name="x" size={16} />
        </ButtonClear>
      </InputArea>

      <Button onPress={onSearch}>
        <Feather name="search" size={16} color={COLORS.TITLE} />
      </Button>
    </Container>
  );
};

export default Search;
