import {
  StyleSheet,
  View,
  TextInput,
  Button,
  SafeAreaView,
  Alert,
} from "react-native";
import { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

export default function NewClient({ route, navigation }) {
  const accountCreatedBy = route.params;
  const url = "http://localhost:4100/client/create";

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyAddress1, setCompanyAddress1] = useState("");
  const [selectedState, setSelectedState] = useState(states[0]);
  const [companyAddress2, setCompanyAddress2] = useState("");

  const companyAddress =
    companyAddress1 + " " + companyAddress2 + " " + selectedState;

  const client = {
    name,
    email,
    phone,
    companyName,
    companyAddress,
    accountCreatedBy,
  };

  const handleAddNewClient = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios({
        method: "post",
        url,
        headers: {
          "Context-Type": "application/json",
          "x-auth-token": token,
        },
        data: client,
      });
      if (res.status == 200) {
        Alert.alert("New Client Added Successfully!");
      } else {
        Alert.alert("Error While Adding New Client!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.formViews}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="black"
            value={name}
            onChangeText={(text) => setName(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="black"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone"
            placeholderTextColor="black"
            value={phone}
            onChangeText={(text) => setPhone(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Company Name"
            placeholderTextColor="black"
            value={companyName}
            onChangeText={(text) => setCompanyName(text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Street"
            placeholderTextColor="black"
            value={companyAddress1}
            onChangeText={(text) => setCompanyAddress1(text)}
          />

          <Picker
            selectedValue={selectedState}
            onValueChange={(itemValue) => setSelectedState(itemValue)}
            style={styles.input}
          >
            {states.map((state) => (
              <Picker.Item key={state} label={state} value={state} />
            ))}
          </Picker>

          <TextInput
            style={styles.input}
            placeholder="City"
            placeholderTextColor="black"
            value={companyAddress2}
            onChangeText={(text) => setCompanyAddress2(text)}
          />
        </View>

        <View style={[styles.buttonContainer, styles.formViews]}>
          <Button
            title="Create New Client"
            color="black"
            onPress={handleAddNewClient}
          />
        </View>
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
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    backgroundColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
  },
  formContainer: {
    marginTop: 30,
    flex: 1,
    width: 400,
  },
  formViews: {
    margin: 10,
  },
});
