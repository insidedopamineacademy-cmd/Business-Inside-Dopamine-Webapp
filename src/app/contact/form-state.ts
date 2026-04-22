export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: Partial<Record<"fullName" | "email" | "need" | "bottleneck" | "notes", string>>;
};

export const initialContactFormState: ContactFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};
