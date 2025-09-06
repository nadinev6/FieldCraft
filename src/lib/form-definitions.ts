export const exampleForm = [
  {
    type: "group",
    label: "Account",
    fields: [
      {
        type: "text",
        label: "Username",
        name: "username",
        required: true,
      },
      {
        type: "password",
        label: "Password",
        name: "password",
        required: true,
      }
    ]
  },
  {
    type: "divider",
    label: "Personal Info"
  },
  {
    type: "group",
    label: "Profile",
    fields: [
      {
        type: "text",
        label: "Full Name",
        name: "fullname"
      },
      {
        type: "date",
        label: "Birthdate",
        name: "birthdate"
      }
    ]
  }
];