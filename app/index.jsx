import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  View,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";

export default function Index() {
  const { colors } = useTheme();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // ⏳ Splash timer
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  // 🖼 SPLASH SCREEN
  if (showSplash) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        <Image
          source={require("../assets/Images/splash2.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    );
  }

  // ⏳ AUTH LOADING (after splash)
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // 🔀 AUTH GATE
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "85%",
    height: "85%",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
