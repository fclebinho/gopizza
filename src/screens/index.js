import { View, Text } from "react-native";
import React from "react";
import auth from "@react-native-firebase/auth";

const Test = () => {
  auth()
    .signInWithEmailAndPassword("fclebinho@gmail.com", "123456")
    .then((value) => {
      console.log(value.user);
    });

  return (
    <View>
      <Text>Test</Text>
    </View>
  );
};

export default Test;
