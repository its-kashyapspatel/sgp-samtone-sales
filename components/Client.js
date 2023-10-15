import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Client({ route, navigation }) {
  const { client, userId } = route.params;
  const clientId = client.clientId;
  const url = `http://localhost:4100/order/client/${client.clientId}`;
  const [clientOrders, setClientOrders] = useState([]);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios({
        method: "get",
        url,
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      if (res.status === 200) {
        setClientOrders(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const goToPlaceOrder = () => {
    navigation.navigate("Place Order", { clientId, userId });
  };

  const goToOrder = (orderId) => {
    navigation.navigate("Order", orderId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.clientInfoContainer}>
        <Text style={styles.clientInfoText}>ClientID: {client.clientId}</Text>
        <Text style={styles.clientInfoText}>Name: {client.name}</Text>
        <Text style={styles.clientInfoText}>Email: {client.email}</Text>
        <Text style={styles.clientInfoText}>Phone: {client.phone}</Text>
        <Text style={styles.clientInfoText}>Company: {client.companyName}</Text>
        <Text style={styles.clientInfoText}>
          Company Address:{client.companyAddress}
        </Text>
      </View>

      <View style={styles.ordersContainer}>
        {clientOrders.length > 0 ? (
          <FlatList
            data={clientOrders}
            keyExtractor={(item) => item.orderId}
            renderItem={({ item }) => (
              <View style={styles.orderItem}>
                <Pressable
                  onPress={() => {
                    goToOrder(item.orderId);
                  }}
                >
                  <Text>OrderId: {item.orderId}</Text>
                  <Text>UserId: {item.userId}</Text>
                  <Text>Placed On: {item.createdOn}</Text>
                </Pressable>
              </View>
            )}
          />
        ) : (
          <View style={styles.noOrder}>
            <Text>No orders for this client.</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Place Order" color="black" onPress={goToPlaceOrder} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  clientInfoContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  clientInfoText: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    fontSize: 16,
    marginBottom: 5,
  },
  ordersContainer: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginBottom: 30,
  },
  orderItem: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    backgroundColor: "#ccc",
    borderRadius: 5,
    width: 300,
    marginBottom: 40,
  },
  noOrder: {
    width: 350,
  },
});
