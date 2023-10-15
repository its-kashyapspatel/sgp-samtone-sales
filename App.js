import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./components/Login";
import Home from "./components/Home";
import Order from "./components/Order";
import Logout from "./components/Logout";
import NewClient from "./components/NewClient";
import SearchClient from "./components/SearchClient";
import Client from "./components/Client";
import PlaceOrder from "./components/PlaceOrder";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerLeft: () => <></>, headerRight: () => <></> }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerLeft: () => <></>, headerRight: () => <Logout /> }}
        />
        <Stack.Screen
          name="Order"
          component={Order}
          options={{ headerLeft: () => <></>, headerRight: () => <Logout /> }}
        />
        <Stack.Screen
          name="New Client"
          component={NewClient}
          options={{ headerLeft: () => <></>, headerRight: () => <Logout /> }}
        />
        <Stack.Screen
          name="Search Client"
          component={SearchClient}
          options={{ headerLeft: () => <></>, headerRight: () => <Logout /> }}
        />
        <Stack.Screen
          name="Client"
          component={Client}
          options={{ headerLeft: () => <></>, headerRight: () => <Logout /> }}
        />
        <Stack.Screen
          name="Place Order"
          component={PlaceOrder}
          options={{ headerLeft: () => <></>, headerRight: () => <Logout /> }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
