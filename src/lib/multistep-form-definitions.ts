// Multi-step form definitions using the new schema structure
import type { z } from "zod";
import type { multiStepFormSchema } from "./form-field-schemas";

// Type inference from the schema
export type MultiStepForm = z.infer<typeof multiStepFormSchema>;

// User Registration Multi-step Form
export const userRegistrationForm: MultiStepForm = {
  steps: [
    {
      title: "Account Setup",
      description: "Create your account credentials",
      fields: [
        {
          type: "heading",
          text: "Create Your Account",
          level: "h2",
          alignment: "center"
        },
        {
          type: "text",
          label: "Username",
          name: "username",
          required: true,
          placeholder: "Enter your username",
          minLength: 3,
          maxLength: 20
        },
        {
          type: "email",
          label: "Email Address",
          name: "email",
          required: true,
          placeholder: "your.email@example.com"
        },
        {
          type: "password",
          label: "Password",
          name: "password",
          required: true,
          placeholder: "Create a strong password",
          minLength: 8
        },
        {
          type: "password",
          label: "Confirm Password",
          name: "confirmPassword",
          required: true,
          placeholder: "Confirm your password"
        }
      ]
    },
    {
      title: "Personal Information",
      description: "Tell us about yourself",
      fields: [
        {
          type: "heading",
          text: "Personal Details",
          level: "h2",
          alignment: "center"
        },
        {
          type: "group",
          label: "Name Information",
          fields: [
            {
              type: "text",
              label: "First Name",
              name: "firstName",
              required: true,
              placeholder: "Your first name"
            },
            {
              type: "text",
              label: "Last Name",
              name: "lastName",
              required: true,
              placeholder: "Your last name"
            }
          ],
          columns: 2
        },
        {
          type: "date",
          label: "Date of Birth",
          name: "dateOfBirth",
          required: true
        },
        {
          type: "select",
          label: "Country",
          name: "country",
          required: true,
          options: [
            { label: "Select your country", value: "", disabled: true },
            { label: "United States", value: "us" },
            { label: "Canada", value: "ca" },
            { label: "United Kingdom", value: "uk" },
            { label: "Germany", value: "de" },
            { label: "France", value: "fr" },
            { label: "Other", value: "other" }
          ]
        }
      ]
    },
    {
      title: "Preferences",
      description: "Customize your experience",
      fields: [
        {
          type: "heading",
          text: "Your Preferences",
          level: "h2",
          alignment: "center"
        },
        {
          type: "group",
          label: "Communication Preferences",
          fields: [
            {
              type: "checkbox",
              label: "Email notifications",
              name: "emailNotifications",
              defaultChecked: true
            },
            {
              type: "checkbox",
              label: "SMS notifications",
              name: "smsNotifications",
              defaultChecked: false
            },
            {
              type: "checkbox",
              label: "Marketing communications",
              name: "marketingCommunications",
              defaultChecked: false
            }
          ]
        },
        {
          type: "radio",
          label: "Preferred Contact Method",
          name: "preferredContact",
          required: true,
          options: [
            { label: "Email", value: "email" },
            { label: "Phone", value: "phone" },
            { label: "SMS", value: "sms" }
          ],
          defaultValue: "email"
        },
        {
          type: "starRating",
          label: "How excited are you to get started?",
          name: "excitementRating",
          maxRating: 5,
          defaultValue: 0,
          allowHalf: true
        }
      ]
    },
    {
      title: "Review & Submit",
      description: "Review your information and complete registration",
      fields: [
        {
          type: "heading",
          text: "Almost Done!",
          level: "h2",
          alignment: "center"
        },
        {
          type: "paragraph",
          text: "Please review your information and add any final comments before submitting your registration.",
          alignment: "center"
        },
        {
          type: "textarea",
          label: "Additional Comments (Optional)",
          name: "comments",
          placeholder: "Any additional information you'd like to share...",
          rows: 4
        },
        {
          type: "checkbox",
          label: "I agree to the Terms of Service and Privacy Policy",
          name: "agreeToTerms",
          required: true
        }
      ]
    }
  ],
  allowStepSkipping: false,
  showStepNumbers: true
};

// Product Feedback Multi-step Form
export const productFeedbackForm: MultiStepForm = {
  steps: [
    {
      title: "Product Information",
      description: "Tell us about the product you're reviewing",
      fields: [
        {
          type: "text",
          label: "Product Name",
          name: "productName",
          required: true,
          placeholder: "Enter the product name"
        },
        {
          type: "select",
          label: "Product Category",
          name: "category",
          required: true,
          options: [
            { label: "Select a category", value: "", disabled: true },
            { label: "Electronics", value: "electronics" },
            { label: "Clothing", value: "clothing" },
            { label: "Home & Garden", value: "home-garden" },
            { label: "Sports & Outdoors", value: "sports" },
            { label: "Books", value: "books" },
            { label: "Other", value: "other" }
          ]
        },
        {
          type: "date",
          label: "Purchase Date",
          name: "purchaseDate",
          required: true
        }
      ]
    },
    {
      title: "Your Experience",
      description: "Rate your experience with the product",
      fields: [
        {
          type: "starRating",
          label: "Overall Rating",
          name: "overallRating",
          maxRating: 5,
          required: true,
          allowHalf: true
        },
        {
          type: "group",
          label: "Detailed Ratings",
          fields: [
            {
              type: "starRating",
              label: "Quality",
              name: "qualityRating",
              maxRating: 5,
              allowHalf: true
            },
            {
              type: "starRating",
              label: "Value for Money",
              name: "valueRating",
              maxRating: 5,
              allowHalf: true
            }
          ],
          columns: 2
        },
        {
          type: "textarea",
          label: "What did you like most?",
          name: "positiveAspects",
          placeholder: "Tell us what you enjoyed about this product...",
          rows: 3
        },
        {
          type: "textarea",
          label: "What could be improved?",
          name: "improvements",
          placeholder: "Share any suggestions for improvement...",
          rows: 3
        }
      ]
    },
    {
      title: "Recommendation",
      description: "Would you recommend this product?",
      fields: [
        {
          type: "radio",
          label: "Would you recommend this product to others?",
          name: "wouldRecommend",
          required: true,
          options: [
            { label: "Definitely yes", value: "definitely-yes" },
            { label: "Probably yes", value: "probably-yes" },
            { label: "Not sure", value: "not-sure" },
            { label: "Probably no", value: "probably-no" },
            { label: "Definitely no", value: "definitely-no" }
          ]
        },
        {
          type: "textarea",
          label: "Final Comments",
          name: "finalComments",
          placeholder: "Any final thoughts about this product?",
          rows: 4
        },
        {
          type: "checkbox",
          label: "I consent to this review being published publicly",
          name: "publishConsent",
          defaultChecked: true
        }
      ]
    }
  ],
  allowStepSkipping: true,
  showStepNumbers: true
};

// Event Registration Multi-step Form
export const eventRegistrationForm: MultiStepForm = {
  steps: [
    {
      title: "Event Selection",
      description: "Choose your event and ticket type",
      fields: [
        {
          type: "select",
          label: "Event",
          name: "eventId",
          required: true,
          options: [
            { label: "Select an event", value: "", disabled: true },
            { label: "Tech Conference 2024", value: "tech-conf-2024" },
            { label: "Design Workshop", value: "design-workshop" },
            { label: "Networking Mixer", value: "networking-mixer" },
            { label: "Product Launch", value: "product-launch" }
          ]
        },
        {
          type: "radio",
          label: "Ticket Type",
          name: "ticketType",
          required: true,
          options: [
            { label: "Early Bird - $99", value: "early-bird" },
            { label: "Regular - $149", value: "regular" },
            { label: "VIP - $299", value: "vip" },
            { label: "Student - $49", value: "student" }
          ]
        },
        {
          type: "number",
          label: "Number of Tickets",
          name: "ticketQuantity",
          required: true,
          min: 1,
          max: 10,
          defaultValue: 1
        }
      ]
    },
    {
      title: "Attendee Information",
      description: "Provide details for all attendees",
      fields: [
        {
          type: "group",
          label: "Primary Attendee",
          fields: [
            {
              type: "text",
              label: "Full Name",
              name: "primaryAttendeeName",
              required: true
            },
            {
              type: "email",
              label: "Email",
              name: "primaryAttendeeEmail",
              required: true
            },
            {
              type: "text",
              label: "Company/Organization",
              name: "primaryAttendeeCompany"
            }
          ]
        },
        {
          type: "textarea",
          label: "Dietary Restrictions or Special Requirements",
          name: "specialRequirements",
          placeholder: "Please list any dietary restrictions, accessibility needs, or other special requirements...",
          rows: 3
        }
      ]
    },
    {
      title: "Payment & Confirmation",
      description: "Complete your registration",
      fields: [
        {
          type: "heading",
          text: "Registration Summary",
          level: "h3"
        },
        {
          type: "paragraph",
          text: "Please review your registration details before completing payment."
        },
        {
          type: "divider",
          label: "Payment Information"
        },
        {
          type: "radio",
          label: "Payment Method",
          name: "paymentMethod",
          required: true,
          options: [
            { label: "Credit Card", value: "credit-card" },
            { label: "PayPal", value: "paypal" },
            { label: "Bank Transfer", value: "bank-transfer" },
            { label: "Company Purchase Order", value: "purchase-order" }
          ]
        },
        {
          type: "checkbox",
          label: "I agree to the event terms and conditions",
          name: "agreeToTerms",
          required: true
        },
        {
          type: "checkbox",
          label: "Send me updates about future events",
          name: "marketingOptIn",
          defaultChecked: false
        }
      ]
    }
  ],
  allowStepSkipping: false,
  showStepNumbers: true
};

// Survey Form with Conditional Logic
export const customerSurveyForm: MultiStepForm = {
  steps: [
    {
      title: "About You",
      description: "Help us understand who you are",
      fields: [
        {
          type: "select",
          label: "Age Group",
          name: "ageGroup",
          required: true,
          options: [
            { label: "Select your age group", value: "", disabled: true },
            { label: "18-24", value: "18-24" },
            { label: "25-34", value: "25-34" },
            { label: "35-44", value: "35-44" },
            { label: "45-54", value: "45-54" },
            { label: "55-64", value: "55-64" },
            { label: "65+", value: "65+" }
          ]
        },
        {
          type: "radio",
          label: "How often do you use our service?",
          name: "usageFrequency",
          required: true,
          options: [
            { label: "Daily", value: "daily" },
            { label: "Weekly", value: "weekly" },
            { label: "Monthly", value: "monthly" },
            { label: "Rarely", value: "rarely" },
            { label: "This is my first time", value: "first-time" }
          ]
        }
      ]
    },
    {
      title: "Your Experience",
      description: "Tell us about your experience with our service",
      fields: [
        {
          type: "starRating",
          label: "Overall Satisfaction",
          name: "overallSatisfaction",
          maxRating: 5,
          required: true,
          allowHalf: true
        },
        {
          type: "group",
          label: "Rate Different Aspects",
          fields: [
            {
              type: "starRating",
              label: "Ease of Use",
              name: "easeOfUse",
              maxRating: 5,
              allowHalf: true
            },
            {
              type: "starRating",
              label: "Customer Support",
              name: "customerSupport",
              maxRating: 5,
              allowHalf: true
            },
            {
              type: "starRating",
              label: "Value for Money",
              name: "valueForMoney",
              maxRating: 5,
              allowHalf: true
            }
          ],
          columns: 3
        },
        {
          type: "textarea",
          label: "What's working well for you?",
          name: "positiveExperience",
          placeholder: "Tell us what you love about our service...",
          rows: 3
        }
      ]
    },
    {
      title: "Feedback & Suggestions",
      description: "Help us improve our service",
      fields: [
        {
          type: "textarea",
          label: "What could we improve?",
          name: "improvementSuggestions",
          placeholder: "Share your ideas for how we can make our service better...",
          rows: 4,
          required: true
        },
        {
          type: "radio",
          label: "How likely are you to recommend us to others?",
          name: "npsScore",
          required: true,
          options: [
            { label: "0 - Not at all likely", value: "0" },
            { label: "1-2 - Very unlikely", value: "1-2" },
            { label: "3-4 - Unlikely", value: "3-4" },
            { label: "5-6 - Neutral", value: "5-6" },
            { label: "7-8 - Likely", value: "7-8" },
            { label: "9-10 - Very likely", value: "9-10" }
          ]
        },
        {
          type: "checkbox",
          label: "I'd like to be contacted about participating in future research",
          name: "futureResearchOptIn",
          defaultChecked: false
        }
      ]
    }
  ],
  allowStepSkipping: true,
  showStepNumbers: true
};

// Export all forms for easy access
export const multiStepForms = {
  userRegistration: userRegistrationForm,
  productFeedback: productFeedbackForm,
  eventRegistration: eventRegistrationForm,
  customerSurvey: customerSurveyForm
};

// Export individual forms
export {
  userRegistrationForm,
  productFeedbackForm,
  eventRegistrationForm,
  customerSurveyForm
};