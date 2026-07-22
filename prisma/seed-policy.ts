export const FAQ_SEED_PRODUCTION_ACKNOWLEDGEMENT =
  "I_UNDERSTAND_THIS_REPLACES_ALL_FAQS";

type FaqSeedPolicyInput = {
  nodeEnv: string | undefined;
  productionAcknowledgement: string | undefined;
};

type FaqSeedRecord = {
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive?: boolean;
};

type FaqSeedWriteResult = {
  count: number;
};

type FaqSeedTransaction = {
  faq: {
    deleteMany(): Promise<unknown>;
    createMany(input: { data: FaqSeedRecord[] }): Promise<FaqSeedWriteResult>;
  };
};

type FaqSeedDatabase = {
  $transaction(
    operation: (transaction: FaqSeedTransaction) => Promise<FaqSeedWriteResult>,
  ): Promise<FaqSeedWriteResult>;
};

export function assertFaqSeedAllowed({
  nodeEnv,
  productionAcknowledgement,
}: FaqSeedPolicyInput): void {
  // NODE_ENV cannot prove which database a CLI invocation targets. Requiring
  // the acknowledgement everywhere prevents a production URL paired with an
  // unset or misleading NODE_ENV from bypassing the destructive guard.
  void nodeEnv;

  if (productionAcknowledgement !== FAQ_SEED_PRODUCTION_ACKNOWLEDGEMENT) {
    throw new Error(
      "FAQ replacement is disabled without the explicit replacement acknowledgement.",
    );
  }
}

export function replaceFaqsAtomically(
  database: FaqSeedDatabase,
  records: FaqSeedRecord[],
): Promise<FaqSeedWriteResult> {
  return database.$transaction(async (transaction) => {
    await transaction.faq.deleteMany();
    return transaction.faq.createMany({ data: records });
  });
}
