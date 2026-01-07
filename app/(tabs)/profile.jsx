import { Ionicons } from "@expo/vector-icons";
import spacing from "@/Constants/spacing";
import { useRouter } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput, // ✅ add this
} from "react-native";


// 🔹 NEW: theme hook
import { useTheme } from "@/context/ThemeContext";

export default function ProfileScreen() {
  const [username, setUsername] = useState("Guest User");
  const [editVisible, setEditVisible] = useState(false);
  const [tempName, setTempName] = useState("");

  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  // 🔹 NEW
  const { colors, isDark, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/(auth)/login");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Profile
        </Text>
        {/* 🌙 / ☀️ TOGGLE */}
        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons
            name={isDark ? "sunny-outline" : "moon-outline"}
            size={26}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* PROFILE HEADER */}
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjyvHWucw3A2Fp8yT-grNLqn6xTAQ4svgUXQ&s",
              }}
              style={styles.avatar}
            />
            <View style={[styles.camera, { backgroundColor: colors.primary }]}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          </View>

          {/* 🔹 HEADER ROW WITH TOGGLE */}
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.name, { color: colors.textPrimary }]}>
                {username}
              </Text>

              <Text style={[styles.email, { color: colors.textSecondary }]}>
                {user?.email || "guest@email.com"}
              </Text>
            </View>
          </View>
        </View>

        {/* OPTIONS */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <ProfileItem
            icon="person-outline"
            label="Edit profile"
            onPress={() => {
              setTempName(username);
              setEditVisible(true);
            }}
          />

          <ProfileItem icon="cube-outline" label="Orders" />
          <ProfileItem icon="settings-outline" label="Settings" />
          <ProfileItem icon="share-social-outline" label="Invite a friend" />
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <ProfileItem icon="help-circle-outline" label="Help" />
          <ProfileItem
            icon="log-out-outline"
            label="Log out"
            danger
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
      {/* ✏️ EDIT NAME MODAL */}
      <Modal transparent visible={editVisible} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "85%",
              backgroundColor: colors.card,
              borderRadius: 16,
              padding: spacing.lg,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: spacing.md,
                color: colors.textPrimary,
              }}
            >
              Edit Name
            </Text>

            <TextInput
              value={tempName}
              onChangeText={setTempName}
              placeholder="Enter your name"
              placeholderTextColor={colors.textSecondary}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 12,
                padding: spacing.md,
                color: colors.textPrimary,
                marginBottom: spacing.md,
              }}
            />

            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity
                onPress={() => setEditVisible(false)}
                style={{ marginRight: spacing.md }}
              >
                <Text style={{ color: colors.textSecondary }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (tempName.trim()) {
                    setUsername(tempName.trim());
                  }
                  setEditVisible(false);
                }}
              >
                <Text style={{ color: colors.primary, fontWeight: "bold" }}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* Reusable row */
function ProfileItem({ icon, label, onPress, danger }) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.row, { borderColor: colors.border }]}
      onPress={onPress}
    >
      <View style={styles.rowLeft}>
        <Ionicons
          name={icon}
          size={20}
          color={danger ? "#ff3b3b" : colors.primary}
        />
        <Text
          style={[
            styles.rowText,
            { color: danger ? "#ff3b3b" : colors.textPrimary },
          ]}
        >
          {label}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#999" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: 32,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: spacing.md,
  },

  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },

  headerRow: {
    width: "100%",
    marginTop: spacing.md,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: spacing.sm,
  },

  camera: {
    position: "absolute",
    bottom: 4,
    right: 4,
    borderRadius: 20,
    padding: 6,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
  },

  email: {
    fontSize: 13,
    marginTop: 2,
  },

  card: {
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowText: {
    marginLeft: spacing.md,
    fontSize: 14,
  },
});
