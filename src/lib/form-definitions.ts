export const exampleForm = [
  {
    type: "group",
    label: "Account",
    fields: [
      { type: "text", label: "Username", name: "username", required: true },
      { type: "password", label: "Password", name: "password", required: true }
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
      { type: "text", label: "Full Name", name: "fullname" },
      { type: "date", label: "Birthdate", name: "birthdate" },
      { 
        type: "starRating", 
        label: "Overall Satisfaction", 
        name: "satisfaction_rating",
        maxRating: 5,
        defaultValue: 0 
      }
    ]
  },
  {
    type: "divider",
    label: "Contact Information"
  },
  {
    type: "group",
    label: "Personal Contact Details",
    columns: 2,
    fields: [
      { type: "text", label: "First Name", name: "firstName", required: true },
      { type: "text", label: "Last Name", name: "lastName", required: true },
      { type: "email", label: "Email Address", name: "email", required: true },
      { type: "text", label: "Phone Number", name: "phoneNumber" }
    ] 
  },
  {
    type: "divider",
    label: "Address Information"
  },
  {
    type: "group",
    label: "Address Information",
    columns: 3,
    fields: [
      { type: "text", label: "Street", name: "street" },
      { type: "text", label: "City", name: "city" },
      { type: "text", label: "Zip Code", name: "zipCode" },
      { type: "text", label: "Country", name: "country" }
    ] 
  },
  {
    type: "group",
    label: "Nested Sections",
    fields: [
      { type: "text", label: "Field 1", name: "field1" },
      {
        type: "divider",
        label: "Subsection A"
      },
      { type: "text", label: "Field 2", name: "field2" },
      {
        type: "divider",
        label: "Subsection B"
      },
      { type: "text", label: "Field 3", name: "field3" }
    ]
  }
  
];