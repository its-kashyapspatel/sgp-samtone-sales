import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";
import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login({ navigation }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const userData = {
    userId,
    password,
  };

  const handleLogin = async () => {
    try {
      const res = await axios({
        method: "post",
        url: "http://localhost:4100/user/login",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(userData),
      });
      if (res.status === 200) {
        const authToken = res.data.token;

        if (authToken) {
          await AsyncStorage.setItem("token", authToken);

          Alert.alert("Success", "Login Successful", [
            {
              text: "OK",
              onPress: () => {
                navigation.replace("Home", userId);
              },
            },
          ]);
        } else {
          Alert.alert("Login Failure", "Invalid Credentials", [{ text: "OK" }]);
        }
      } else {
        Alert.alert("Login Failure", "Invalid Credentials", [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.logoText1}>Samtone</Text>
        <Text style={styles.logoText2}>Sales</Text>
      </View>

      <View>
        <TextInput
          placeholder="User ID"
          placeholderTextColor="#000"
          value={userId}
          onChangeText={(text) => setUserId(text.toLowerCase())}
          style={styles.input}
        />
        <TextInput
          secureTextEntry={true}
          placeholder="password"
          placeholderTextColor="#000"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
        />

        <View style={styles.buttonContainer}>
          <Button color="black" title="Login" onPress={handleLogin} />
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
  logo: {
    margin: 5,
    padding: 5,
    alignItems: "center",
  },
  logoText1: {
    fontSize: 45,
    fontWeight: "bold",
  },
  logoText2: {
    fontSize: 15,
    letterSpacing: 15,
    fontStyle: "italic",
    paddingLeft: 15,
  },
  input: {
    height: 40,
    width: 350,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
    padding: 10,
  },
  buttonContainer: {
    backgroundColor: "#ccc",
    borderRadius: 5,
    borderWidth: 1,
    marginTop: 20,
  },
});
