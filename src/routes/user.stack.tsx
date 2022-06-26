import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { UserTabRoutes } from "./user.tab";

import { useAuth } from "@/hooks";
import { HomeScreen, ProductScreen, OrderScreen } from "@/screens";

const { Navigator, Screen, Group } = createNativeStackNavigator();

export const UserStackRoutes = () => {
  const { user } = useAuth();
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      {user?.isAdmin ? (
        <Group>
          <Screen name="home" component={HomeScreen} />
          <Screen name="product" component={ProductScreen} />
        </Group>
      ) : (
        <Group>
          <Screen name="userTabRoutes" component={UserTabRoutes} />
          <Screen name="order" component={OrderScreen} />
        </Group>
      )}
    </Navigator>
  );
};
