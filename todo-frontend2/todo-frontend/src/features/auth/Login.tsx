import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Heading,
  VStack,
  Alert,
  AlertIcon,
  Flex,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { login } from "./authSlice";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof schema>;

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector(
    (state: RootState) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    dispatch(login(data));
  };

  React.useEffect(() => {
    if (token) navigate("/dashboard");
    // eslint-disable-next-line
  }, [token]);

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Box
        bg="white"
        p={10}
        rounded="lg"
        shadow="lg"
        minW="350px"
        w="100%"
        maxW="400px"
      >
        <Heading mb={8} size="lg" textAlign="center" color="blue.700">
          Login
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={6} align="stretch">
            <FormControl isInvalid={!!errors.username}>
              <FormLabel color="gray.700">Username</FormLabel>
              <Input {...register("username")} color="gray.800" bg="gray.100" />
              <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
              <FormLabel color="gray.700">Password</FormLabel>
              <Input
                type="password"
                {...register("password")}
                color="gray.800"
                bg="gray.100"
              />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>
            {error && (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            )}
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={loading}
              w="full"
              size="lg"
            >
              Login
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default Login;
