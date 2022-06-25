import auth from "@react-native-firebase/auth";
import React from "react";
import { View, Text } from "react-native";

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
