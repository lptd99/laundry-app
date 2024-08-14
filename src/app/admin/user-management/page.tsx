"use client";

import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

// Placeholder for user data type
type User = {
  name: string;
  email: string;
  password?: string;
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User>({ name: "", email: "" });
  const [render, setRender] = useState(false);
  const router = useRouter();
  const userUID = localStorage.getItem("userUID");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<User>();
  const onSubmit: SubmitHandler<User> = (data) => console.log(data);

  // Fetch users from backend (placeholder)
  useEffect(() => {
    if (userUID && userUID.accessLevel === "admin") {
      setRender(true);
    } else {
      router.push("/login");
    }
    const fetchUsers = async () => {
      // Placeholder for fetching user data
      const fetchedUsers: User[] = [
        { name: "John Doe", email: "john@example.com" },
        // Add more users or fetch from an API
      ];
      setUsers(fetchedUsers);
    };

    fetchUsers();
  }, []);
  // Handle user deletion
  const handleDelete = (userEmail: string) => {
    // Placeholder for deleting a user
    setUsers(users.filter((user) => user.email !== userEmail));
  };

  const handleAddUserClick = () => {};

  return (
    render && (
    <section id="PAGE">
      <section id="USERS_LIST">
        {users.map((user) => (
          <section
            key={user.email}
            id="USER">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <button onClick={() => handleDelete(user.email)}>Delete</button>
          </section>
        ))}
      </section>
      <button
        id="NEW_USER_BUTTON"
        onClick={handleAddUserClick}>
        <UserPlus />
      </button>
    </section>
  );
}
