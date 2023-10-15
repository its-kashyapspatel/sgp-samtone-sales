import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SearchClient({ route, navigation }) {
  const userId = route.params;
  const [searchOption, setSearchOption] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [clientList, setClientList] = useState([]);
  let url = "";

  const getUrl = () =>
    searchOption
      ? `http://localhost:4100/client/id/${searchValue}`
      : `http://localhost:4100/client/name/${searchValue}`;

  const toggleSearchOption = () => {
    setSearchOption(!searchOption);
    setSearchValue("");
    setClientList([]);
  };

  const handleSearch = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios({
        method: "get",
        url: await getUrl(),
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      if (res.status == 200) {
        setClientList(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const goToClient = (item) => {
    navigation.navigate("Client", { client: item, userId });
  };

  const renderClientItem = ({ item }) => (
    <View style={styles.listElement}>
      <Pressable onPress={() => goToClient(item)}>
        <Text style={styles.userInfoText}>{item.clientId}</Text>
        <Text style={styles.userInfoText}>{item.name}</Text>
        <Text style={styles.userInfoText}>{item.companyName}</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.buttonContainer}>
          <Button
            title="Change Search Option"
            onPress={toggleSearchOption}
            color="black"
          />
        </View>

        {searchOption ? (
          <TextInput
            style={styles.input}
            placeholder="Client Id"
            value={searchValue}
            onChangeText={(text) => setSearchValue(text)}
          />
        ) : (
          <TextInput
            style={styles.input}
            placeholder="Client Name"
            value={searchValue}
            onChangeText={(text) => setSearchValue(text)}
          />
        )}

        <View style={styles.buttonContainer}>
          <Button title="Search" onPress={handleSearch} color="black" />
        </View>
        <View style={styles.listContainer}>
          {clientList.length > 0 ? (
            <FlatList
              data={clientList}
              keyExtractor={(item) => item.clientId.toString()}
              renderItem={renderClientItem}
            />
          ) : (
            <Text>No clients found</Text>
          )}
        </View>
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
  buttonContainer: {
    backgroundColor: "#ccc",
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  box: {
    marginTop: 30,
    flex: 1,
    width: 400,
  },
  listContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  userInfoText: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    fontSize: 16,
    marginBottom: 5,
  },
  listElement: {
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
    marginBottom: 5,
  },
});
