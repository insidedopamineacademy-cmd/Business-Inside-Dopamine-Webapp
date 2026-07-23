export type FAQListItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  order: number;
};

export type FAQEditorActions = {
  createFAQ: (data: unknown) => Promise<FAQListItem>;
  updateFAQ: (id: unknown, data: unknown) => Promise<FAQListItem>;
  deleteFAQ: (id: unknown) => Promise<{ success: true }>;
};
