import { Button } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Logout() {
  const navigation = useNavigation();

  const handleLogOut = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  return <Button title="Log Out" onPress={handleLogOut} />;
}
