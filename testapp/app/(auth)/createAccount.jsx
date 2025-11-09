import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system"; // ✅ Modern import (no /legacy)

// -------------------------------------------------------

const CreateAccountPage = () => {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    Email: "",
    Phone: "",
    FullName: "",
    Role: "Salesperson",

    CompanyName: "",
    CompanyAddress: "",
    CompanyGSTNumber: "",
    CompanyWebsite: "",
    CompanyLogoUrl: null,
    InvoiceNumber: "",

    BankName: "",
    BranchName: "",
    AccountNumber: "",
    IfscCode: "",
    UpiId: "",
    QrCode: null,

    CompanyId: "",
    Balance: 0,
    Currency: "INR",
    SubscriptionPlanId: "",
    SubscriptionType: "",
    SubscriptionStatus: "InActive",
    Features_MaxQuotesPerMonth: 0,
    Features_QuoteCharge: 0,
    Features_PaymentProofUpload: false,
    Features_InAppNotifications: false,
    Features_WebNotifications: false,
    Features_AnalyticsDashboard: false,
    LoginDevices: {
      Web: {
        LoggedIn: false,
        LastLogin: null,
        DeviceInfo: null,
      },
      Mobile: {
        LoggedIn: false,
        LastLogin: null,
        DeviceInfo: null,
      },
    },
    Preferences: {
      Notifications: {
        InApp: true,
        Email: true,
        SMS: false,
        WebPush: true,
      },
      Theme: "light",
      Language: "en",
    },
  });

  // -------------------------------------------------------
  // Load + save progress from AsyncStorage
  useEffect(() => {
    loadSavedData();
  }, []);

  useEffect(() => {
    if (!isLoading) saveFormData();
  }, [formData, currentStep, isLoading]);

  const loadSavedData = async () => {
    try {
      const savedFormData = await AsyncStorage.getItem("createAccountFormData");
      const savedStep = await AsyncStorage.getItem("createAccountCurrentStep");
      if (savedFormData) setFormData(JSON.parse(savedFormData));
      if (savedStep) setCurrentStep(parseInt(savedStep));
    } catch (error) {
      console.error("Error loading saved data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFormData = async () => {
    try {
      await AsyncStorage.setItem(
        "createAccountFormData",
        JSON.stringify(formData)
      );
      await AsyncStorage.setItem(
        "createAccountCurrentStep",
        currentStep.toString()
      );
    } catch (error) {
      console.error("Error saving form data:", error);
    }
  };

  // -------------------------------------------------------
  // Utilities

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "We need gallery access to upload images."
      );
      return false;
    }
    return true;
  };

  const convertToBase64 = async (uri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error("Error converting to base64:", error);
      throw error;
    }
  };

  // -------------------------------------------------------
  // Logo upload

  const handleLogoUpload = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const fileInfo = await FileSystem.getInfoAsync(asset.uri);
        if (fileInfo.size > 5 * 1024 * 1024) {
          Alert.alert("File Too Large", "Select an image under 5MB.");
          return;
        }

        const base64 = await convertToBase64(asset.uri);
        updateFormData("CompanyLogoUrl", `data:image/jpeg;base64,${base64}`);
        Alert.alert("Success", "Logo uploaded!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload logo.");
      console.error("Logo upload error:", error);
    }
  };

  // -------------------------------------------------------
  // QR upload

  const handleQRUpload = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const fileInfo = await FileSystem.getInfoAsync(asset.uri);
        if (fileInfo.size > 2 * 1024 * 1024) {
          Alert.alert("File Too Large", "Select an image under 2MB.");
          return;
        }

        const base64 = await convertToBase64(asset.uri);
        updateFormData("QrCode", `data:image/jpeg;base64,${base64}`);
        Alert.alert("Success", "QR code uploaded!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload QR code.");
      console.error("QR upload error:", error);
    }
  };

  // -------------------------------------------------------
  // Steps logic

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return (
          formData.FullName && formData.Email && formData.Phone && formData.Role
        );
      case 2:
        return formData.CompanyName && formData.CompanyAddress;
      case 3:
        return formData.BankName && formData.AccountNumber;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      Alert.alert("Missing Info", "Please complete all required fields.");
      return;
    }
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const fillEmptyFields = (data) => {
    const currentDate = new Date().toISOString();
    const companyNamePart =
      data.CompanyName?.replace(/\s+/g, "").substring(0, 6).toUpperCase() ||
      "COMP";
    const usernamePart =
      data.Email?.split("@")[0]?.substring(0, 4).toUpperCase() || "USER";
    const mobileLast4 = data.Phone?.slice(-4) || "0000";
    const companyId = `${companyNamePart}${usernamePart}${mobileLast4}`;

    const deviceInfo = {
      platform: Platform.OS,
      version: Platform.Version,
    };

    return {
      ...data,
      CompanyId: data.CompanyId || companyId,
      LoginDevices: {
        ...data.LoginDevices,
        Mobile: {
          LoggedIn: true,
          LastLogin: currentDate,
          DeviceInfo: deviceInfo,
        },
      },
    };
  };

  const showToast = (msg) => {
    if (Platform.OS === "android") ToastAndroid.show(msg, ToastAndroid.SHORT);
    else Alert.alert("Info", msg);
  };

  // -------------------------------------------------------
  // API submit

  const handleSubmit = async () => {
    try {
      const completeFormData = fillEmptyFields(formData);
      const response = await fetch(
        "https://sg76vqy4vi.execute-api.ap-south-1.amazonaws.com/salesapp/Auth",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(completeFormData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem(
          "userProfile",
          JSON.stringify(completeFormData)
        );
        await AsyncStorage.removeItem("createAccountFormData");
        await AsyncStorage.setItem("accountCreated", "true");
        showToast("Account created successfully!");
        router.push("/(auth)/PaymentGateway/payment");
      } else {
        Alert.alert("Error", result.message || "Failed to create account.");
      }
    } catch (error) {
      Alert.alert("Error", "Network issue. Please retry.");
      console.error("Submit error:", error);
    }
  };

  // -------------------------------------------------------
  // UI helpers

  const renderProgressBar = () => (
    <View className="bg-purple-100 h-2">
      <View
        className="bg-purple-500 h-full transition-all duration-300"
        style={{ width: `${(currentStep / 3) * 100}%` }}
      />
    </View>
  );

  const renderStepTitle = () => {
    const titles = {
      1: { title: "Personal Info", subtitle: "Tell us about yourself" },
      2: { title: "Organization Info", subtitle: "Your company details" },
      3: { title: "Payment Info", subtitle: "Banking & payment setup" },
    };
    return (
      <View className="px-6 py-4">
        <Text className="text-2xl font-bold text-gray-900">
          {titles[currentStep].title}
        </Text>
        <Text className="text-gray-600 mt-1">{titles[currentStep].subtitle}</Text>
      </View>
    );
  };

  // Step 1
  const renderStep1 = () => (
    <View className="px-6 space-y-4">
      <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <View className="items-center mb-6">
          <Ionicons name="person" size={40} color="#7c3aed" />
          <Text className="mt-2 text-xl font-semibold text-gray-900">
            Welcome!
          </Text>
          <Text className="text-gray-500">Let's get to know you</Text>
        </View>
        <TextInput
          placeholder="Full Name *"
          value={formData.FullName}
          onChangeText={(v) => updateFormData("FullName", v)}
          className="bg-gray-50 rounded-xl px-4 py-3 mb-3"
        />
        <TextInput
          placeholder="Email *"
          keyboardType="email-address"
          value={formData.Email}
          onChangeText={(v) => updateFormData("Email", v)}
          className="bg-gray-50 rounded-xl px-4 py-3 mb-3"
        />
        <TextInput
          placeholder="Phone *"
          keyboardType="phone-pad"
          value={formData.Phone}
          onChangeText={(v) => updateFormData("Phone", v)}
          className="bg-gray-50 rounded-xl px-4 py-3"
        />
      </View>
    </View>
  );

  // Step 2
  const renderStep2 = () => (
    <View className="px-6 space-y-4">
      <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <Ionicons
          name="business"
          size={40}
          color="#7c3aed"
          style={{ alignSelf: "center", marginBottom: 8 }}
        />
        <Text className="text-center text-lg font-semibold mb-4">
          Organization Details
        </Text>
        <TextInput
          placeholder="Company Name *"
          value={formData.CompanyName}
          onChangeText={(v) => updateFormData("CompanyName", v)}
          className="bg-gray-50 rounded-xl px-4 py-3 mb-3"
        />
        <TextInput
          placeholder="Company Address *"
          value={formData.CompanyAddress}
          onChangeText={(v) => updateFormData("CompanyAddress", v)}
          className="bg-gray-50 rounded-xl px-4 py-3 mb-3"
        />
        <TextInput
          placeholder="Website"
          value={formData.CompanyWebsite}
          onChangeText={(v) => updateFormData("CompanyWebsite", v)}
          className="bg-gray-50 rounded-xl px-4 py-3 mb-3"
        />

        <Pressable
          onPress={handleLogoUpload}
          className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl py-5 items-center"
        >
          {formData.CompanyLogoUrl ? (
            <Image
              source={{ uri: formData.CompanyLogoUrl }}
              className="w-16 h-16 rounded-lg mb-2"
            />
          ) : (
            <Ionicons name="cloud-upload" size={32} color="#9ca3af" />
          )}
          <Text className="text-gray-600 mt-2">
            {formData.CompanyLogoUrl ? "Change Logo" : "Upload Logo"}
          </Text>
        </Pressable>
      </View>
    </View>
  );

  // Step 3
  const renderStep3 = () => (
    <View className="px-6 space-y-4">
      <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <Ionicons
          name="card"
          size={40}
          color="#7c3aed"
          style={{ alignSelf: "center", marginBottom: 8 }}
        />
        <Text className="text-center text-lg font-semibold mb-4">
          Payment Setup
        </Text>
        <TextInput
          placeholder="Bank Name *"
          value={formData.BankName}
          onChangeText={(v) => updateFormData("BankName", v)}
          className="bg-gray-50 rounded-xl px-4 py-3 mb-3"
        />
        <TextInput
          placeholder="Branch"
          value={formData.BranchName}
          onChangeText={(v) => updateFormData("BranchName", v)}
          className="bg-gray-50 rounded-xl px-4 py-3 mb-3"
        />
        <TextInput
          placeholder="Account Number *"
          value={formData.AccountNumber}
          onChangeText={(v) => updateFormData("AccountNumber", v)}
          keyboardType="numeric"
          className="bg-gray-50 rounded-xl px-4 py-3 mb-3"
        />
        <TextInput
          placeholder="IFSC Code"
          value={formData.IfscCode}
          onChangeText={(v) => updateFormData("IfscCode", v)}
          autoCapitalize="characters"
          className="bg-gray-50 rounded-xl px-4 py-3 mb-3"
        />
        <Pressable
          onPress={handleQRUpload}
          className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl py-5 items-center"
        >
          {formData.QrCode ? (
            <Image
              source={{ uri: formData.QrCode }}
              className="w-20 h-20 rounded-lg mb-2"
            />
          ) : (
            <Ionicons name="qr-code" size={32} color="#9ca3af" />
          )}
          <Text className="text-gray-600 mt-2">
            {formData.QrCode ? "Change QR Code" : "Upload QR Code"}
          </Text>
        </Pressable>
      </View>
    </View>
  );

  // Buttons
  const renderButtons = () => (
    <View className="px-6 py-4 flex-row gap-4">
      {currentStep > 1 && (
        <Pressable
          onPress={prevStep}
          className="flex-1 bg-gray-200 rounded-full py-4 items-center"
        >
          <Text className="text-gray-700 font-semibold">Previous</Text>
        </Pressable>
      )}
      <Pressable
        onPress={currentStep === 3 ? handleSubmit : nextStep}
        className="flex-1 overflow-hidden rounded-full"
      >
        <LinearGradient
          colors={["#7c3aed", "#5b21b6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingVertical: 16 }}
        >
          <Text className="text-center text-white font-semibold text-base">
            {currentStep === 3 ? "Complete Setup" : "Continue"}
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );

  // -------------------------------------------------------
  // Render

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <Ionicons name="hourglass" size={40} color="#7c3aed" />
        <Text className="mt-3 text-gray-600">Loading your progress...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View
        className="bg-white px-5 py-4"
        style={{ paddingTop: insets.top + 16 }}
      >
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace("/(auth)")
            }
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </Pressable>
          <Text className="text-xl font-semibold text-gray-900">
            Create Account
          </Text>
          <View className="w-6" />
        </View>
      </View>

      {renderProgressBar()}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          {renderStepTitle()}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </ScrollView>

        {renderButtons()}
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreateAccountPage;
