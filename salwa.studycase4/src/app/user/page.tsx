import React, { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { getUser, deleteUser } from "../service"; // Import deleteUser function

import { UserForm } from "./addUser";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import type { UserProps } from "../types/type";

const USERS_PER_PAGE = 3; // Number of users to display per page

export const User = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [userToEdit, setUserToEdit] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  const { data, isLoading, error, refetch } = useQuery(
    ["user_telkom_malang", currentPage], // Unique key includes current page
    () => getUser(currentPage, USERS_PER_PAGE), // Fetch users for the current page
    {
      refetchInterval: 3000,
      retry: 3,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    }
  );

//   mutasi = perubahan data
  const mutation = useMutation(deleteUser, {
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
    },
  });

  const handleDelete = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      mutation.mutate(userId);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1); // Go to the next page
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1)); // Go to the previous page
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  return (
    <Box sx={{ padding: "45px" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setIsEdit(false);
          setUserToEdit("");
        }}
      >
        Add User
      </Button>
      {data.data.map((user: UserProps) => (
        <Card key={user.id_user} sx={{ margin: "10px 0" }}>
          <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body1">{user.nama_user}</Typography>
            <div>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setIsEdit(true);
                  setUserToEdit(user.id_user);
                }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete(user.id_user)}
                sx={{ marginLeft: "10px" }}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        <Button
          variant="outlined"
          onClick={handlePreviousPage}
          disabled={currentPage === 1} 
        >
          Previous
        </Button>
        <Typography>
          Page {currentPage}
        </Typography>
        <Button
          variant="outlined"
          onClick={handleNextPage}
          disabled={data.data.length < USERS_PER_PAGE} 
        >
          Next
        </Button>
      </Box>

      <UserForm isEdit={isEdit} userId={userToEdit} />
    </Box>
  );
};
