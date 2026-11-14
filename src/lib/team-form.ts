// Team form schema for Zod validation
export const teamFormSchema = {
  fields: [
    { name: "name", type: "text", label: "Name", required: true },
    { name: "role", type: "text", label: "Role / Position", required: true },
    { name: "bio", type: "textarea", label: "Bio", required: false },
    { name: "imageUrl", type: "url", label: "Photo URL", required: false },
    { name: "sortOrder", type: "number", label: "Sort Order", required: false },
    { name: "isVisible", type: "boolean", label: "Visible on website", required: false },
  ],
};
