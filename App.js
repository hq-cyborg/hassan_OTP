import React, { useEffect, useRef, useState } from "react";
import {
  Platform, SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  RecaptchaVerifier, signInWithPhoneNumber, signOut, onAuthStateChanged,
} from "firebase/auth";
import { auth, firebaseConfig } from "./firebase";
import { theme } from "./theme";

// Phones use a WebView-based reCAPTCHA modal; the browser (Expo web) uses the normal widget.
const RecaptchaModal =
  Platform.OS === "web" ? null : require("expo-firebase-recaptcha").FirebaseRecaptchaVerifierModal;

export default function App() {
  const [step, setStep] = useState("phone"); // phone | otp | done
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [busy, setBusy] = useState(false);
  const [user, setUser] = useState(null);

  const confirmation = useRef(null);
  const modalRef = useRef(null);
  const webVerifier = useRef(null);

  const say = (text, type = "") => setMsg({ text, type });

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setUser(u);
        setStep(u ? "done" : "phone");
      }),
    []
  );

  const getVerifier = () => {
    if (Platform.OS !== "web") return modalRef.current;
    if (!webVerifier.current) {
      webVerifier.current = new RecaptchaVerifier(auth, "recaptcha-container", { size: "normal" });
    }
    return webVerifier.current;
  };

  const sendOtp = async () => {
    const number = phone.trim();
    if (!number.startsWith("+")) return say("Include the country code, e.g. +92...", "err");
    setBusy(true);
    try {
      confirmation.current = await signInWithPhoneNumber(auth, number, getVerifier());
      setStep("otp");
      say("OTP sent. Check your phone.", "ok");
    } catch (e) {
      say(e.code || e.message, "err");
      if (Platform.OS === "web" && webVerifier.current) {
        webVerifier.current.render().then((id) => window.grecaptcha.reset(id));
      }
    }
    setBusy(false);
  };

  const verifyOtp = async () => {
    try {
      await confirmation.current.confirm(otp.trim());
      say("");
    } catch (e) {
      say(e.code === "auth/invalid-verification-code" ? "Wrong code, try again." : e.code || e.message, "err");
    }
  };

  const logout = () => {
    signOut(auth);
    setPhone("");
    setOtp("");
    say("");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      {RecaptchaModal && (
        <RecaptchaModal ref={modalRef} firebaseConfig={firebaseConfig} attemptInvisibleVerification={false} />
      )}
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>{theme.title}</Text>

          {step === "phone" && (
            <View>
              <Text style={styles.label}>Phone number (with country code)</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder={theme.phonePlaceholder}
                placeholderTextColor={theme.muted}
                keyboardType="phone-pad"
                autoCapitalize="none"
              />
              {Platform.OS === "web" && <View nativeID="recaptcha-container" style={styles.captcha} />}
              <TouchableOpacity style={[styles.button, busy && styles.disabled]} onPress={sendOtp} disabled={busy}>
                <Text style={styles.buttonText}>Send OTP</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === "otp" && (
            <View>
              <Text style={styles.label}>Enter the 6-digit code</Text>
              <TextInput
                style={styles.input}
                value={otp}
                onChangeText={setOtp}
                placeholder={theme.otpPlaceholder}
                placeholderTextColor={theme.muted}
                keyboardType="number-pad"
                maxLength={6}
              />
              <TouchableOpacity style={styles.button} onPress={verifyOtp}>
                <Text style={styles.buttonText}>Verify OTP</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === "done" && (
            <View>
              <Text style={[styles.success, { color: theme.success }]}>Login successful!</Text>
              <Text style={styles.text}>Phone: {user?.phoneNumber}</Text>
              <Text style={[styles.text, styles.uid]}>UID: {user?.uid}</Text>
              <TouchableOpacity style={styles.button} onPress={logout}>
                <Text style={styles.buttonText}>Sign out</Text>
              </TouchableOpacity>
            </View>
          )}

          {!!msg.text && (
            <Text style={[styles.msg, { color: msg.type === "err" ? theme.danger : theme.success }]}>
              {msg.text}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.background },
  scroll: { flexGrow: 1, alignItems: "center", paddingTop: 60, paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    width: "100%", maxWidth: 380, padding: 28, backgroundColor: theme.card, borderRadius: theme.radius,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  title: { fontSize: 22, fontWeight: "700", color: theme.text, marginBottom: 12 },
  label: { fontSize: 14, color: theme.muted },
  input: {
    marginTop: 10, padding: 10, fontSize: 16, color: theme.text, backgroundColor: theme.inputBg,
    borderWidth: 1, borderColor: theme.inputBorder, borderRadius: 6,
  },
  captcha: { marginTop: 10, alignItems: "center" },
  button: { marginTop: 10, padding: 12, backgroundColor: theme.accent, borderRadius: 6, alignItems: "center" },
  buttonText: { color: theme.accentText, fontSize: 16, fontWeight: "600" },
  disabled: { opacity: 0.5 },
  msg: { marginTop: 12, fontSize: 14 },
  success: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  text: { fontSize: 15, color: theme.text, marginVertical: 4 },
  uid: { fontSize: 12, color: theme.muted },
});
