import FAQEditor from "./FAQEditor";
import {
  createFAQ,
  deleteFAQ,
  getFAQs,
  updateFAQ,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function FAQManagerPage() {
  const faqs = await getFAQs();

  return (
    <FAQEditor
      initialFaqs={faqs}
      createFAQ={createFAQ}
      updateFAQ={updateFAQ}
      deleteFAQ={deleteFAQ}
    />
  );
}
