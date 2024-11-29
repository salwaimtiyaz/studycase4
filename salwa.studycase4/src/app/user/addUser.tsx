import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { addUser, getUserById, updateUser } from "../service";
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Divider,
  Paper,
  Alert,
} from "@mui/material";
import type { UserProps } from "../types/type";

interface UserFormProps {
  isEdit: boolean;
  userId: string;
}

export const UserForm: React.FC<Partial<UserFormProps>> = ({
  isEdit = false,
  userId,
}) => {
  const queryClient = useQueryClient();

  const [userData, setUserData] = useState<UserProps>({
    id_user: "",
    nama_user: "",
    username: "",
    password: "",
    role: "",
    status: "published",
  });

  const formRef = React.useRef<HTMLFormElement>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: fetchedUserData, isLoading: isEditingLoading } = useQuery(
    ["user", userId],
    () => getUserById(userId || ""),
    {
      enabled: isEdit && !!userId,
      onSuccess: (data) => {
        if (data?.data) {
          setUserData(data.data);
        }
      },
    }
  );

  useEffect(() => {
    if (fetchedUserData?.data && isEdit) {
      setUserData(fetchedUserData.data);
    }
  }, [fetchedUserData, isEdit]);

  const resetForm = () => {
    setUserData({
      id_user: "",
      nama_user: "",
      username: "",
      password: "",
      role: "",
      status: "published",
    });
  };

  const addMutation = useMutation(addUser, {
    onSuccess: () => {
      setSuccessMessage("User added successfully!");
      resetForm();
      setTimeout(() => setSuccessMessage(null), 2000);
    },
    onError: (error) => {
      console.error("Error adding user:", error);
    },
  });

  const updateMutation = useMutation(
    (data: UserProps) => updateUser(userId || "", data),
    {
      onMutate: async (newData) => {
        await queryClient.cancelQueries(["user", userId]);
        const previousUserData = queryClient.getQueryData(["user", userId]);
        queryClient.setQueryData(["user", userId], newData);
        return { previousUserData };
      },
      onError: (_, __, context) => {
        queryClient.setQueryData(["user", userId], context.previousUserData);
      },
      onSettled: () => {
        queryClient.invalidateQueries(["user", userId]);
      },
      onSuccess: () => {
        setSuccessMessage("User updated successfully!");
        resetForm();
        setTimeout(() => setSuccessMessage(null), 2000);
      },
    }
  );

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name as string]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    isEdit ? updateMutation.mutate(userData) : addMutation.mutate(userData);
  };

  if (isEditingLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper
      elevation={4}
      sx={{
        padding: 4,
        borderRadius: 3,
        maxWidth: 400,
        margin: "20px auto",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
        color="primary"
        gutterBottom
      >
        {isEdit ? "Edit User" : "Add User"}
      </Typography>
      <Divider sx={{ marginBottom: 2 }} />
      <form ref={formRef} onSubmit={handleSubmit}>
        <TextField
          label="Nama User"
          name="nama_user"
          value={userData.nama_user || ""}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Username"
          name="username"
          value={userData.username || ""}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Role</InputLabel>
          <Select
            name="role"
            value={userData.role || ""}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>Select Role</em>
            </MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="kasir">Kasir</MenuItem>
            <MenuItem value="manajer">Manajer</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          sx={{ marginTop: 2 }}
          disabled={addMutation.isLoading || updateMutation.isLoading}
        >
          {isEdit
            ? updateMutation.isLoading
              ? "Updating..."
              : "Update User"
            : addMutation.isLoading
            ? "Adding..."
            : "Add User"}
        </Button>
        {(addMutation.isError || updateMutation.isError) && (
          <Alert severity="error" sx={{ marginTop: 2 }}>
            Error {isEdit ? "updating" : "adding"} user:{" "}
            {isEdit
              ? updateMutation.error?.message
              : addMutation.error?.message}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ marginTop: 2 }}>
            {successMessage}
          </Alert>
        )}
      </form>
    </Paper>
  );
};
