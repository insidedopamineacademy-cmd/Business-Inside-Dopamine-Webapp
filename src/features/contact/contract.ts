import {
  contactEnquiryOptions,
  contactEnquiryValues,
  type ContactEnquiryValue,
} from "@/data/portfolio";

export { contactEnquiryOptions, contactEnquiryValues };
export type { ContactEnquiryValue };

export const contactFieldDefinitions = {
  fullName: { type: "text", maxLength: 100 },
  email: { type: "email", maxLength: 254 },
  company: { type: "text", maxLength: 120 },
  phone: { type: "tel", maxLength: 32 },
  need: { type: "select", maxLength: 80 },
  bottleneck: { type: "textarea", maxLength: 4_000 },
  preferredDate: { type: "date", maxLength: 10 },
  preferredTime: { type: "time", maxLength: 5 },
  notes: { type: "textarea", maxLength: 2_000 },
} as const;

export const contactFieldNames = Object.keys(
  contactFieldDefinitions,
) as Array<keyof typeof contactFieldDefinitions>;

export type ContactFieldName = (typeof contactFieldNames)[number];
export type ContactFieldType =
  (typeof contactFieldDefinitions)[ContactFieldName]["type"];
export type ContactFormValues = Partial<Record<ContactFieldName, string>>;

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: Partial<Record<ContactFieldName, string>>;
  values: ContactFormValues;
  idempotencyKey?: string;
  requestId?: string;
};

export type ContactFormAction = (
  previousState: ContactFormState,
  formData: FormData,
) => Promise<ContactFormState>;

export const initialContactFormState: ContactFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
  values: {},
};

export function isContactEnquiryValue(value: string): value is ContactEnquiryValue {
  return contactEnquiryValues.includes(value as ContactEnquiryValue);
}
