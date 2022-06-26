import firestore from "@react-native-firebase/firestore";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { useTheme } from "styled-components/native";

import { ButtonMenu } from "@/components";
import { useAuth } from "@/hooks";
import { HomeScreen, OrdersScreen } from "@/screens";

const { Navigator, Screen } = createBottomTabNavigator();

export const UserTabRoutes = () => {
  const { COLORS } = useTheme();
  const { user } = useAuth();

  const [notifications, setNotifications] = useState("0");

  useEffect(() => {
    const subscribe = firestore()
      .collection("orders")
      .where("waiter_id", "==", user?.id)
      .where("status", "==", "Pronto")
      .onSnapshot((query) => {
        setNotifications(String(query.docs.length));
      });

    return () => subscribe();
  }, []);

  return (
    <Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.SECONDARY_900,
        tabBarInactiveTintColor: COLORS.SECONDARY_400,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 80,
          paddingVertical: Platform.OS === "ios" ? 20 : 0,
        },
      }}>
      <Screen
        name="home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color }) => <ButtonMenu color={color} title="Cardápio" /> }}
      />
      <Screen
        name="orders"
        component={OrdersScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <ButtonMenu color={color} title="Pedidos" notification={notifications} />
          ),
        }}
      />
    </Navigator>
  );
};
