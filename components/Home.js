import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  Button,
  SafeAreaView,
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home({ route, navigation }) {
  const [userDetail, setUserDetail] = useState([]);
  const [userOrders, setUserOrders] = useState([]);

  const userId = route.params;
  const orderUrl = `http://localhost:4100/order/user/${userId}`;
  const userUrl = `http://localhost:4100/user/${userId}`;

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    try {
      const res1 = await axios({
        method: "get",
        url: userUrl,
      });
      if (res1.status == 200) {
        setUserDetail(res1.data);
      }
      const token = await AsyncStorage.getItem("token");
      const res2 = await axios({
        method: "get",
        url: orderUrl,
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      if (res2.status == 200) {
        setUserOrders(res2.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const goToOrder = (orderId) => {
    navigation.navigate("Order", orderId);
  };

  const goToSearchClient = () => {
    navigation.navigate("Search Client", userId);
  };

  const goToNewClient = () => {
    navigation.navigate("New Client", userId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfoContainer}>
        {userDetail && (
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.userInfoText}>
              User Id: {userDetail.userId}
            </Text>
            <Text style={styles.userInfoText}>
              User Name: {userDetail.name}
            </Text>
            <Text style={styles.userInfoText}>
              User Email: {userDetail.email}
            </Text>
            <Text style={styles.userInfoText}>
              User Phone: {userDetail.phone}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.ordersContainer}>
        {userOrders.length > 0 ? (
          <FlatList
            data={userOrders}
            keyExtractor={(item) => item.orderId}
            renderItem={({ item }) => (
              <View style={styles.orderItem}>
                <Pressable
                  onPress={() => {
                    goToOrder(item.orderId);
                  }}
                >
                  <Text>OrderId: {item.orderId}</Text>
                  <Text>ClientId: {item.clientId}</Text>
                  <Text>Placed On: {item.createdOn}</Text>
                </Pressable>
              </View>
            )}
          />
        ):(
          <View style={styles.noOrder}>
            <Text>No orders yet.</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Search Client"
          color="black"
          onPress={goToSearchClient}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="New Client" color="black" onPress={goToNewClient} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  userInfoContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  userInfoText: {
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
    marginBottom: 20,
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
    marginBottom: 20,
  },
  noOrder: {
    width: 350,
  },
});
