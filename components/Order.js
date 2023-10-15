import { StyleSheet, View, Text, FlatList, SafeAreaView } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home({ route, navigation }) {
  const [orderDetail, setOrderDetail] = useState(null);

  const orderId = route.params;
  const url = `http://localhost:4100/order/${orderId}`;

  useEffect(() => {
    getOrderDetails();
  }, []);

  const getOrderDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios({
        method: "get",
        url: url,
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      if (res.status == 200) {
        setOrderDetail(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {orderDetail ? (
          <View>
            <View style={styles.orderInfoContainer}>
              <Text style={styles.orderInfoText}>
                Order Id: {orderDetail[0].orderId}
              </Text>
              <Text style={styles.orderInfoText}>
                Client Id: {orderDetail[0].clientId}
              </Text>
              <Text style={styles.orderInfoText}>
                User Id: {orderDetail[0].userId}
              </Text>
              <Text style={styles.orderInfoText}>
                Placed On: {formatDate(orderDetail[0].createdOn)}
              </Text>
            </View>
            <View style={styles.products}>
              <FlatList
                data={orderDetail[0].product}
                keyExtractor={(productName) => productName}
                renderItem={({ item: productName, index }) => (
                  <View key={index} style={styles.product}>
                    <Text>Product: {productName} </Text>
                    <Text>Quantity: {orderDetail[0].qty[index]}</Text>
                  </View>
                )}
              />
            </View>
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  orderInfoContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  orderInfoText: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    fontSize: 16,
    marginBottom: 5,
  },
  products: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginBottom: 20,
  },
  product: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    marginBottom: 10,
  },
});
