import React, { useState, useEffect } from "react";
import { Text, View, Button, TextInput, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation, CommonActions } from "@react-navigation/native";

function PlaceOrder({ route }) {
  const [quantities, setQuantities] = useState({});
  const [productOptions, setProductOptions] = useState([]);
  const urlGetProducts = "http://localhost:4100/product/all";
  const urlPlaceOrder = "http://localhost:4100/order/place";

  useEffect(() => {
    getProducts();
  }, []);

  const navigation = useNavigation();

  const getProducts = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios({
        method: "get",
        url: urlGetProducts,
        headers: {
          "Context-Type": "application/json",
          "x-auth-token": token,
        },
      });
      if (res.status == 200) {
        setProductOptions(res.data);
      } else {
        Alert.alert("Error While Fetching Products!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const placeOrder = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const orderData = {
        userId: route.params.userId,
        clientId: route.params.clientId,
        product: Object.keys(quantities),
        qty: Object.values(quantities),
      };
      Alert.alert(
        "Confirm Order",
        "Are you sure you want to place this order?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              const res = await axios({
                method: "post",
                url: urlPlaceOrder,
                headers: {
                  "Content-Type": "application/json",
                  "x-auth-token": token,
                },
                data: orderData,
              });

              if (res.status === 200) {
                console.log(res.data);
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: "Home", params: route.params.userId }],
                  })
                );
              } else {
                console.log(res.data);
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const updateQuantity = (productId, quantity) => {
    const trimmedQuantity = quantity.trim();
    if (
      trimmedQuantity.length > 0 &&
      /^\d+$/.test(trimmedQuantity) &&
      Number.isInteger(Number(trimmedQuantity))
    ) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: trimmedQuantity,
      }));
    } else {
      console.log(
        "Invalid quantity. Please enter a valid non-decimal numeric value."
      );
    }
  };

  return (
    <View style={{ margin: 30 }}>
      {productOptions && (
        <FlatList
          data={productOptions}
          keyExtractor={(item) => item.productId}
          renderItem={({ item }) => (
            <View>
              <Text>Id: {item.productId}</Text>
              <Text>Name: {item.name}</Text>
              <TextInput
                placeholder="Quantity"
                keyboardType="numeric"
                value={quantities[item.productId]}
                onChangeText={(text) => updateQuantity(item.productId, text)}
              />
            </View>
          )}
        />
      )}
      <View style={{ height: 40 }} />
      <Button title="Place Order" onPress={placeOrder} />
    </View>
  );
}

export default PlaceOrder;
