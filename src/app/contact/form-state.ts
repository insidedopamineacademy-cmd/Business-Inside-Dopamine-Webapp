export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: Partial<
    Record<
      | "fullName"
      | "email"
      | "company"
      | "phone"
      | "need"
      | "bottleneck"
      | "preferredDate"
      | "preferredTime"
      | "notes",
      string
    >
  >;
  values: Partial<
    Record<
      | "fullName"
      | "email"
      | "company"
      | "phone"
      | "need"
      | "bottleneck"
      | "preferredDate"
      | "preferredTime"
      | "notes",
      string
    >
  >;
  idempotencyKey?: string;
  requestId?: string;
};

export const initialContactFormState: ContactFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  values: {},
};
