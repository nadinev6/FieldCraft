// Multi-step form definitions for complex forms
export const multiStepForms = {
  // User Registration Flow
  registrationFlow: {
    steps: [
      {
        title: "Account Creation",
        fields: [
          { type: "text", label: "Username", name: "username", required: true },
          { type: "password", label: "Password", name: "password", required: true }
        ]
      },
      {
        title: "Profile Setup",
        fields: [
          { type: "text", label: "Full Name", name: "fullname" },
          { type: "date", label: "Birthdate", name: "birthdate" },
          { 
            type: "starRating", 
            label: "Experience Rating", 
            name: "experience_rating",
            maxRating: 5,
            defaultValue: 0,
            allowHalf: true
          }
        ]
      },
      {
        title: "Contact Information",
        fields: [
          { type: "text", label: "Email", name: "email", required: true },
            { type: "tel", label: "Phone", name: "phone" }
        ]
      },
      {
        title: "Final Review",
        fields: [
          { type: "textarea", label: "Comments", name: "comments", rows: 4 },
            { type: "starRating", label: "Overall Satisfaction", name: "overall_satisfaction", maxRating: 5 }
        ]
      }
    ]
  },

  // Product Feedback Flow
  productFeedback: {
    steps: [
      {
        title: "Product Details",
        fields: [
          { type: "text", label: "Product Name", name: "product_name" },
            { type: "select", label: "Category", name: "category", options: [...] }
        ]
      },
      {
        title: "Feature Requests",
        fields: [
          { type: "textarea", label: "Describe Features", name: "features" },
            { type: "checkbox", label: "Urgent", name: "urgent" }
        ]
      },
      {
        title: "Overall Rating",
        fields: [
          { type: "starRating", label: "Overall Satisfaction", name: "overall_rating", maxRating: 5 }
        ]
      }
    ]
  },

  // Survey Form
  surveyForm: {
    steps: [
      {
        title: "Demographics",
        fields: [
          { type: "text", label: "Age", name: "age" },
            { type: "select", label: "Gender", name: "gender", options: [...] }
        ]
      },
      {
        title: "Feedback",
        fields: [
          { type: "textarea", label: "Comments", name: "comments" },
            { type: "starRating", label: "Satisfaction", name: "satisfaction", maxRating: 5 }
        ]
      }
    ]
  }
};