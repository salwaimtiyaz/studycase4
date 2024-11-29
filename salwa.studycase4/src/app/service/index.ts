import type { UserProps } from "../types/type";
import { baseURL, headers, url_user } from "../utils";

export const getUser = async (page: number, limit: number) => {
    const res = await fetch(
        `${baseURL}${url_user}?filter[_and][0][status][_eq]=published&page=${page}&limit=${limit}`, // Add pagination parameters
        {
            method: "GET",
            headers: headers,
        }
    );

    if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data;
};

export const addUser = async (data: UserProps) => {
    const res = await fetch(
        `${baseURL}${url_user}`,
        {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data),
        },
    );

    if (!res.ok) {
        const errorResponse = await res.json(); // Parse the error response
        console.error("Error response:", errorResponse); // Log the error response
        throw new Error(`Error: ${res.status} ${res.statusText} - ${errorResponse.message}`);
    }
};


export const updateUser = async (id: string, data: UserProps) => {
    await fetch(
        `${baseURL}${url_user}/${id}`,
        {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify(data),
        },
    );
};

export const deleteUser = async (id: string) => {
    const deletedAt = new Date().toISOString(); // Get current date and time in ISO format
    await fetch(`${baseURL}${url_user}/${id}`, {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify({ date_deleted: deletedAt, status: "archived" }), // Add deleted_at field
    });
};

export const getUserById = async (id: string): Promise<UserProps | null> => {
    const response = await fetch(`${baseURL}${url_user}/${id}`, {
        method: "GET",
        headers: headers,
    });

    console.log("Response status:", response.status); // Tambahkan logging untuk status

    if (!response.ok) {
        console.error("Failed to fetch user data", response.status, response.statusText);
        throw new Error(`Failed to fetch user: ${response.status} ${response.statusText}`);
    }

    const data: UserProps = await response.json();
    console.log("Fetched user data:", data); // Logging data untuk debug
    return data;
};
