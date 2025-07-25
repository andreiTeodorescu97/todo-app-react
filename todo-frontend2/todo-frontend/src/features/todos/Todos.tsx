import React from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Checkbox,
  IconButton,
  Spinner,
  Button,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "./todosSlice";

import { EditIcon, DeleteIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";

const Todos: React.FC = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { todos, loading } = useSelector((state: RootState) => state.todos);
  const { categories } = useSelector((state: RootState) => state.categories);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValues, setEditValues] = React.useState({
    name: "",
    description: "",
    categoryId: "",
  });
  const [newTodo, setNewTodo] = React.useState({
    name: "",
    description: "",
    categoryId: "",
  });
  const [adding, setAdding] = React.useState(false);

  React.useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleToggleCompleted = (todo: any) => {
    dispatch(updateTodo(todo.id, { completed: !todo.completed }));
  };

  const handleEdit = (todo: any) => {
    setEditingId(todo.id);
    setEditValues({
      name: todo.name,
      description: todo.description,
      categoryId: todo.categoryId,
    });
  };

  const handleEditSave = (todo: any) => {
    dispatch(updateTodo(todo.id, editValues));
    setEditingId(null);
    toast({ title: "Todo updated", status: "success", duration: 1500 });
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteTodo(id));
    toast({ title: "Todo deleted", status: "info", duration: 1500 });
  };

  const handleAdd = () => {
    dispatch(addTodo(newTodo));
    setNewTodo({ name: "", description: "", categoryId: "" });
    setAdding(false);
    toast({ title: "Todo added", status: "success", duration: 1500 });
  };

  return (
    <Box
      p={10}
      bg="white"
      rounded="lg"
      shadow="lg"
      m={8}
      maxW="700px"
      mx="auto"
    >
      <Heading mb={8} color="blue.700">
        ToDos
      </Heading>
      <VStack spacing={6} align="stretch">
        <HStack>
          <Input
            placeholder="Name"
            value={newTodo.name}
            onChange={(e) =>
              setNewTodo((v) => ({ ...v, name: e.target.value }))
            }
            color="gray.800"
            bg="gray.100"
          />
          <Input
            placeholder="Description"
            value={newTodo.description}
            onChange={(e) =>
              setNewTodo((v) => ({ ...v, description: e.target.value }))
            }
            color="gray.800"
            bg="gray.100"
          />
          <Select
            placeholder="Category"
            value={newTodo.categoryId}
            onChange={(e) =>
              setNewTodo((v) => ({ ...v, categoryId: e.target.value }))
            }
            color="gray.800"
            bg="gray.100"
          >
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
          <Button
            colorScheme="blue"
            onClick={handleAdd}
            isLoading={adding}
            size="md"
          >
            Add
          </Button>
        </HStack>
        {loading && <Spinner />}
        {todos.map((todo) => (
          <Box
            key={todo.id}
            p={4}
            shadow="sm"
            borderWidth={1}
            rounded="md"
            bg={todo.completed ? "green.50" : "gray.50"}
          >
            <HStack>
              <Checkbox
                isChecked={todo.completed}
                onChange={() => handleToggleCompleted(todo)}
                colorScheme="blue"
                isDisabled={todo.completed}
              />
              {editingId === todo.id && !todo.completed ? (
                <>
                  <Input
                    value={editValues.name}
                    onChange={(e) =>
                      setEditValues((v) => ({ ...v, name: e.target.value }))
                    }
                    w="120px"
                    color="gray.800"
                    bg="gray.100"
                  />
                  <Input
                    value={editValues.description}
                    onChange={(e) =>
                      setEditValues((v) => ({
                        ...v,
                        description: e.target.value,
                      }))
                    }
                    w="180px"
                    color="gray.800"
                    bg="gray.100"
                  />
                  <Select
                    value={editValues.categoryId}
                    onChange={(e) =>
                      setEditValues((v) => ({
                        ...v,
                        categoryId: e.target.value,
                      }))
                    }
                    w="120px"
                    color="gray.800"
                    bg="gray.100"
                  >
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </Select>
                  <IconButton
                    aria-label="Save"
                    icon={<CheckIcon />}
                    onClick={() => handleEditSave(todo)}
                    size="sm"
                    colorScheme="green"
                  />
                  <IconButton
                    aria-label="Cancel"
                    icon={<CloseIcon />}
                    onClick={handleEditCancel}
                    size="sm"
                    colorScheme="gray"
                  />
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() =>
                      dispatch(updateTodo(todo.id, { completed: true }))
                    }
                  >
                    Complete
                  </Button>
                </>
              ) : (
                <>
                  <Box flex={1} color="gray.700">
                    <b>{todo.name}</b> - {todo.description} [
                    {categories.find((c: any) => c.id === todo.categoryId)
                      ?.name || "No category"}
                    ]
                  </Box>
                  {!todo.completed && (
                    <>
                      <IconButton
                        aria-label="Edit"
                        icon={<EditIcon />}
                        onClick={() => handleEdit(todo)}
                        size="sm"
                        colorScheme="blue"
                      />
                      <IconButton
                        aria-label="Delete"
                        icon={<DeleteIcon />}
                        onClick={() => handleDelete(todo.id)}
                        size="sm"
                        colorScheme="red"
                      />
                    </>
                  )}
                </>
              )}
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default Todos;
