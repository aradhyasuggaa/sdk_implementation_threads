const Users = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    subject: "Meeting Reminder",
    date: "2024-06-18",
    has_attachments: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "098-765-4321",
    subject: "Project Update",
    date: "2024-06-17",
    has_attachments: false,
  },
  {
    id: "3",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phone: "555-555-5555",
    subject: "Invoice Attached",
    date: "2024-06-16",
    has_attachments: true,
  },
];

export async function getUserId({
  query,
  type,
}: {
  query: string;
  type: string;
}): Promise<string> {
  const user = Users.find((user) => {
    if (type === "email") {
      return user.email === query;
    } else if (type === "phone") {
      return user.phone === query;
    } else if (type === "name") {
      return user.name === query;
    } else {
      return false;
    }
  });

  if (user) {
    return user.id;
  } else {
    throw new Error("User not found");
  }
}
