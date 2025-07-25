import React from "react";
import { Box, Flex, VStack, Heading, Button } from "@chakra-ui/react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./features/auth/Login";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "./store";
import { logout } from "./features/auth/authSlice";
import Todos from "./features/todos/Todos";
import Categories from "./features/categories/Categories";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "ToDos", path: "/todos" },
  { label: "Categories", path: "/categories" },
  { label: "User", path: "/user" },
];

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  return (
    <VStack
      as="nav"
      spacing={4}
      align="stretch"
      p={4}
      minW="200px"
      bg="gray.100"
      h="100vh"
      borderRight="1px solid #e2e8f0"
    >
      <Heading size="md" mb={8} textAlign="center" color="blue.700">
        ToDo App
      </Heading>
      {navItems.map((item) => (
        <Button
          as={NavLink}
          to={item.path}
          key={item.path}
          variant="ghost"
          color="gray.700"
          fontWeight="bold"
          justifyContent="flex-start"
          borderRadius="md"
          _activeLink={{
            bg: "blue.100",
            color: "blue.800",
            border: "1px solid #90cdf4",
          }}
          _hover={{ bg: "gray.200", color: "blue.700" }}
          px={4}
          py={6}
          fontSize="lg"
        >
          {item.label}
        </Button>
      ))}
      <Button
        colorScheme="red"
        mt={12}
        onClick={handleLogout}
        size="lg"
        borderRadius="md"
      >
        Logout
      </Button>
    </VStack>
  );
}

function Dashboard() {
  return (
    <Box p={10} bg="white" rounded="lg" shadow="lg" m={8}>
      Dashboard (placeholder)
    </Box>
  );
}
function User() {
  return (
    <Box p={10} bg="white" rounded="lg" shadow="lg" m={8}>
      User (placeholder)
    </Box>
  );
}

function App() {
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate("/dashboard");
    // eslint-disable-next-line
  }, []);

  if (!token) {
    return <Login />;
  }

  return (
    <Flex minH="100vh" bg="gray.50">
      <Sidebar />
      <Box flex={1} bg="gray.50">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/todos" element={<Todos />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </Box>
    </Flex>
  );
}

export default App;
