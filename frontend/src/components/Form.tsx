import classes from "@/modules/Flipstax.module.css";
import {
  Anchor,
  Box,
  Button,
  Flex,
  Image,
  Text,
  TextInput,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type FormType = "login" | "register";

interface FormProps {
  type: FormType;
}

interface FormData {
  email: string;
  password: string;
}

export function Form({ type }: FormProps) {
  const { colorScheme } = useMantineColorScheme();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  useEffect(() => {
    document.title = (isLogin ? "Log In" : "Register") + " • Flipstax";
  }, []);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const isLogin = type === "login";

  const handleInputChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log("Form submitted:", formData);
    if (isLogin) {
    } else {
      //Registering user
    }
  };

  const handleGoogleSuccess = (credentialResponse: any) => {
    console.log("Google login success:", credentialResponse);
    // TODO: Implement Google login success handler
  };

  const handleGoogleError = () => {
    console.error("Google login failed");
    // TODO: Implement error handling
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        w={500}
        className={`${colorScheme === "light" ? classes.light : classes.dark} ${
          classes.box
        }`}
        m={20}
      >
        {/* Logo Section */}
        <Flex align="center" justify="center" mb={32}>
          <Box component="a" href="/" className={classes.link}>
            <Flex align="center">
              <Image
                src="/img/login-logo.png"
                h={50}
                w={50}
                alt="Flipstax Logo"
              />
              <Title pl={10}>Flipstax</Title>
            </Flex>
          </Box>
        </Flex>

        {/* Form Content */}
        <Flex align="center" justify="center" direction="column" gap="md">
          <Text size="xl" fw={500}>
            {isLogin ? "Log In" : "Create Account"}
          </Text>

          <Text size="sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Anchor
              component={Link}
              to={isLogin ? "/register" : "/login"}
              underline="never"
              className={classes.customAnchor}
            >
              {isLogin ? "Sign Up" : "Log In"}
            </Anchor>
          </Text>

          <TextInput
            value={formData.email}
            onChange={handleInputChange("email")}
            label="Email"
            placeholder="Your email"
            withAsterisk
            w="80%"
            required
          />

          <TextInput
            value={formData.password}
            onChange={handleInputChange("password")}
            type={passwordVisible ? "text" : "password"}
            label="Password"
            placeholder="Your password"
            withAsterisk
            w="80%"
            rightSection={
              <i
                onClick={() => setPasswordVisible(!passwordVisible)}
                className={`fa-regular ${
                  passwordVisible ? "fa-eye" : "fa-eye-slash"
                }`}
                style={{ cursor: "pointer" }}
              />
            }
            required
          />

          <Box style={{ colorScheme: "light" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
            />
          </Box>

          <Button type="submit" w={180}>
            {isLogin ? "Log In" : "Register"}
          </Button>
        </Flex>
      </Box>
    </GoogleOAuthProvider>
  );
}
