import React from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Input,
  Button,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { EditIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import {
  fetchCategories,
  addCategory,
  updateCategory,
} from "./categoriesSlice";

const Categories: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const { categories } = useSelector((state: RootState) => state.categories);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState("");
  const [newCategory, setNewCategory] = React.useState("");
  const [adding, setAdding] = React.useState(false);

  React.useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleEdit = (cat: any) => {
    setEditingId(cat.id);
    setEditValue(cat.name);
  };

  const handleEditSave = (cat: any) => {
    dispatch(updateCategory(cat.id, { name: editValue }));
    setEditingId(null);
    toast({ title: "Category updated", status: "success", duration: 1500 });
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  const handleAdd = () => {
    dispatch(addCategory({ name: newCategory }));
    setNewCategory("");
    setAdding(false);
    toast({ title: "Category added", status: "success", duration: 1500 });
  };

  return (
    <Box
      p={10}
      bg="white"
      rounded="lg"
      shadow="lg"
      m={8}
      maxW="500px"
      mx="auto"
    >
      <Heading mb={8} color="blue.700">
        Categories
      </Heading>
      <VStack spacing={6} align="stretch">
        <HStack>
          <Input
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            color="gray.800"
            bg="gray.100"
          />
          <Button
            colorScheme="blue"
            onClick={handleAdd}
            isLoading={adding}
            size="md"
          >
            Add
          </Button>
        </HStack>
        {categories.map((cat) => (
          <HStack key={cat.id} p={2} borderWidth={1} rounded="md" bg="gray.50">
            {editingId === cat.id ? (
              <>
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  w="180px"
                  color="gray.800"
                  bg="gray.100"
                />
                <IconButton
                  aria-label="Save"
                  icon={<CheckIcon />}
                  onClick={() => handleEditSave(cat)}
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
              </>
            ) : (
              <>
                <Box flex={1} color="gray.700">
                  {cat.name}
                </Box>
                <IconButton
                  aria-label="Edit"
                  icon={<EditIcon />}
                  onClick={() => handleEdit(cat)}
                  size="sm"
                  colorScheme="blue"
                />
              </>
            )}
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default Categories;
