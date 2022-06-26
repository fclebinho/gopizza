import { NavigationContainer } from "@react-navigation/native";

import { UserStackRoutes } from "./user.stack";
import { UserTabRoutes } from "./user.tab";

import { useAuth } from "@/hooks";
import { SignInScreen } from "@/screens";

export const Routes = () => {
  const { user } = useAuth();

  return <NavigationContainer>{user ? <UserStackRoutes /> : <SignInScreen />}</NavigationContainer>;
};
