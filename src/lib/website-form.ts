// Website content form schema for Zod validation
export const websiteFormSchema = {
  fields: [
    { name: "name", type: "text", label: "Name", required: true },
    { name: "role", type: "text", label: "Role", required: false },
    { name: "bio", type: "textarea", label: "Bio", required: false },
    { name: "imageUrl", type: "url", label: "Photo URL", required: false },
    { name: "sortOrder", type: "number", label: "Sort Order", required: false },
    { name: "isVisible", type: "boolean", label: "Visible on website", required: false },
    { name: "rating", type: "number", label: "Rating (1-5)", required: true },
    { name: "comment", type: "textarea", label: "Comment", required: false },
    { name: "alt", type: "text", label: "Alt Text", required: false },
    { name: "category", type: "text", label: "Category", required: false },
    { name: "question", type: "textarea", label: "Question", required: true },
    { name: "answer", type: "textarea", label: "Answer", required: true },
    { name: "key", type: "text", label: "Setting Key", required: true },
    { name: "value", type: "textarea", label: "Value", required: false },
    { name: "label", type: "text", label: "Label", required: false },
  ],
};
