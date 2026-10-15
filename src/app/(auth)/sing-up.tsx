
import { useSignUp, useAuth } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type SignUpForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  code: string;
};

export default function SignUp() {
  const { signUp, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [user, setUser] = useState<SignUpForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    code: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  const isLoading = fetchStatus === "fetching";

  const isVerifying =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;

  const handleOnChange = (
    field: keyof SignUpForm,
    value: string
  ) => {
    setUser((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrorMessage("");
  };

  const handleOnSignUp = async () => {
    setErrorMessage("");

    if (
      !user.firstName.trim() ||
      !user.lastName.trim() ||
      !user.email.trim() ||
      !user.password
    ) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const { error } = await signUp.password({
        emailAddress: user.email.trim(),
        password: user.password,
        firstName: user.firstName.trim(),
        lastName: user.lastName.trim(),
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      const result = await signUp.verifications.sendEmailCode();

      if (result.error) {
        setErrorMessage(result.error.message);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to create your account. Please try again."
      );
    }
  };

  const handleOnVerify = async () => {
    setErrorMessage("");

    if (!user.code.trim()) {
      setErrorMessage("Please enter the verification code.");
      return;
    }

    try {
      const { error } =
        await signUp.verifications.verifyEmailCode({
          code: user.code.trim(),
        });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: ({ decorateUrl }) => {
            router.replace(decorateUrl("/") as any);
          },
        });
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Verification failed. Please try again."
      );
    }
  };

  const handleResendCode = async () => {
    setErrorMessage("");
    setIsResending(true);

    try {
      const { error } =
        await signUp.verifications.sendEmailCode();

      if (error) {
        setErrorMessage(error.message);
      } else {
        Alert.alert(
          "Code sent",
          "A new verification code has been sent to your email."
        );
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to resend the code."
      );
    } finally {
      setIsResending(false);
    }
  };

  if (isSignedIn || signUp.status === "complete") {
    return null;
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 py-12">
          <Image
            source={require("../../../assets/images/logo.png")}
            className="mb-8 h-16 w-32"
            resizeMode="contain"
          />

          {isVerifying ? (
            <>
              <Text className="mb-2 text-3xl font-bold text-gray-800">
                Verify your account
              </Text>

              <Text className="mb-8 text-gray-500">
                We sent a verification code to {user.email}
              </Text>

              <TextInput
                value={user.code}
                onChangeText={(text) =>
                  handleOnChange("code", text)
                }
                placeholder="Enter verification code"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                autoCapitalize="none"
                autoCorrect={false}
                className="mb-4 w-full rounded-xl border border-gray-300 px-4 py-3"
              />

              {errorMessage ? (
                <Text className="mb-4 text-red-500">
                  {errorMessage}
                </Text>
              ) : null}

              <TouchableOpacity
                onPress={handleOnVerify}
                disabled={isLoading}
                className="mb-4 w-full items-center rounded-xl bg-blue-600 py-4"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-base font-bold text-white">
                    Verify email
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleResendCode}
                disabled={isResending || isLoading}
                className="items-center py-2"
              >
                {isResending ? (
                  <ActivityIndicator color="#2563EB" />
                ) : (
                  <Text className="font-semibold text-blue-600">
                    Resend verification code
                  </Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text className="mb-2 text-3xl font-bold text-gray-800">
                Create account
              </Text>

              <Text className="mb-8 text-gray-500">
                Find your dream home today
              </Text>

              <View className="mb-4 flex-row gap-3">
                <TextInput
                  value={user.firstName}
                  onChangeText={(text) =>
                    handleOnChange("firstName", text)
                  }
                  placeholder="First name"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                  autoCorrect={false}
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-3"
                />

                <TextInput
                  value={user.lastName}
                  onChangeText={(text) =>
                    handleOnChange("lastName", text)
                  }
                  placeholder="Last name"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                  autoCorrect={false}
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-3"
                />
              </View>

              <TextInput
                value={user.email}
                onChangeText={(text) =>
                  handleOnChange("email", text)
                }
                placeholder="Email address"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                className="mb-4 w-full rounded-xl border border-gray-300 px-4 py-3"
              />

              <TextInput
                value={user.password}
                onChangeText={(text) =>
                  handleOnChange("password", text)
                }
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="newPassword"
                className="mb-4 w-full rounded-xl border border-gray-300 px-4 py-3"
              />

              {errorMessage ? (
                <Text className="mb-4 text-red-500">
                  {errorMessage}
                </Text>
              ) : null}

              <TouchableOpacity
                onPress={handleOnSignUp}
                disabled={isLoading}
                className="mb-4 w-full items-center rounded-xl bg-blue-600 py-4"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-base font-bold text-white">
                    Sign Up
                  </Text>
                )}
              </TouchableOpacity>

              <View className="flex-row justify-center">
                <Text className="text-gray-500">
                  Already have an account?{" "}
                </Text>

                <Link href="./sign-in">
                  <Text className="font-semibold text-blue-600">
                    Sign In
                  </Text>
                </Link>
              </View>

              <View nativeID="clerk-captcha" />
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
