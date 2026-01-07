import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import colors from "@/Constants/colors";
import spacing from "@/Constants/spacing";

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 Password validation (final check)
  const validatePassword = (password) => {
    if (!password) return "Password cannot be empty";
    if (password.length < 6)
      return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(password))
      return "Password must contain one uppercase letter";
    if (!/[a-z]/.test(password))
      return "Password must contain one lowercase letter";
    if (!/[0-9]/.test(password))
      return "Password must contain one number";
    if (!/[!@#$%^&*]/.test(password))
      return "Password must contain one special character";

    return null;
  };

  // 🔹 Smart hint (single line)
  const getPasswordHint = (password) => {
    if (!password) return "Password must be at least 6 characters";
    if (password.length < 6) return "Add more characters";
    if (!/[A-Z]/.test(password)) return "Add an uppercase letter";
    if (!/[0-9]/.test(password)) return "Add a number";
    if (!/[!@#$%^&*]/.test(password))
      return "Add a special character";

    return "Strong password";
  };

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const error = validatePassword(password);
    if (error) {
      Alert.alert("Invalid Password", error);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Account created");
      router.replace("/(auth)/login");
    } catch (error) {
      Alert.alert("Signup failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* 🔹 SMART SINGLE-LINE HINT */}
      <Text
        style={[
          styles.passwordHint,
          {
            color:
              getPasswordHint(password) === "Strong password"
                ? "#2ecc71"
                : colors.textSecondary,
          },
        ]}
      >
        {getPasswordHint(password)}
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
        <Text style={styles.link}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: spacing.lg,
    color: colors.textPrimary,
    textAlign: "center",
  },
  input: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  passwordHint: {
    fontSize: 12,
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 14,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: spacing.md,
    textAlign: "center",
    color: colors.primary,
  },
});
