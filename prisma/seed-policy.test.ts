import { describe, expect, it } from "vitest";

import {
  FAQ_SEED_PRODUCTION_ACKNOWLEDGEMENT,
  assertFaqSeedAllowed,
  replaceFaqsAtomically,
} from "./seed-policy";

type SeedDatabase = Parameters<typeof replaceFaqsAtomically>[0];
type SeedRecords = Parameters<typeof replaceFaqsAtomically>[1];

const existingRecords: SeedRecords = [
  {
    question: "Existing question",
    answer: "Existing answer",
    category: "Existing",
    order: 1,
  },
];

const replacementRecords: SeedRecords = [
  {
    question: "Replacement question",
    answer: "Replacement answer",
    category: "Replacement",
    order: 1,
  },
];

function createTransactionalFixture({ failCreate = false } = {}) {
  let committedRecords = structuredClone(existingRecords);
  const events: string[] = [];

  const database: SeedDatabase = {
    async $transaction(operation) {
      events.push("transaction:start");
      let stagedRecords = structuredClone(committedRecords);

      const result = await operation({
        faq: {
          async deleteMany() {
            events.push("delete");
            stagedRecords = [];
          },
          async createMany({ data }) {
            events.push("create");
            if (failCreate) {
              throw new Error("simulated create failure");
            }

            stagedRecords = structuredClone(data);
            return { count: data.length };
          },
        },
      });

      committedRecords = stagedRecords;
      events.push("transaction:commit");
      return result;
    },
  };

  return {
    database,
    events,
    getCommittedRecords: () => committedRecords,
  };
}

describe("FAQ seed production policy", () => {
  it.each([undefined, "development", "test"])(
    "does not trust NODE_ENV=%s as proof of a non-production database",
    (nodeEnv) => {
      expect(() =>
        assertFaqSeedAllowed({
          nodeEnv,
          productionAcknowledgement: undefined,
        }),
      ).toThrow(/explicit replacement acknowledgement/i);
    },
  );

  it("rejects production without acknowledgement", () => {
    expect(() =>
      assertFaqSeedAllowed({
        nodeEnv: "production",
        productionAcknowledgement: undefined,
      }),
    ).toThrow(/explicit replacement acknowledgement/i);
  });

  it("rejects an inexact production acknowledgement", () => {
    expect(() =>
      assertFaqSeedAllowed({
        nodeEnv: "production",
        productionAcknowledgement: "yes",
      }),
    ).toThrow(/explicit replacement acknowledgement/i);
  });

  it("allows production only with the exact acknowledgement", () => {
    expect(() =>
      assertFaqSeedAllowed({
        nodeEnv: "production",
        productionAcknowledgement: FAQ_SEED_PRODUCTION_ACKNOWLEDGEMENT,
      }),
    ).not.toThrow();
  });

  it("allows an isolated development target only with the same exact acknowledgement", () => {
    expect(() =>
      assertFaqSeedAllowed({
        nodeEnv: "development",
        productionAcknowledgement: FAQ_SEED_PRODUCTION_ACKNOWLEDGEMENT,
      }),
    ).not.toThrow();
  });
});

describe("atomic FAQ replacement", () => {
  it("deletes and creates inside one committed transaction", async () => {
    const fixture = createTransactionalFixture();

    await expect(
      replaceFaqsAtomically(fixture.database, replacementRecords),
    ).resolves.toEqual({ count: 1 });

    expect(fixture.events).toEqual([
      "transaction:start",
      "delete",
      "create",
      "transaction:commit",
    ]);
    expect(fixture.getCommittedRecords()).toEqual(replacementRecords);
  });

  it("does not commit an empty table when creation fails", async () => {
    const fixture = createTransactionalFixture({ failCreate: true });

    await expect(
      replaceFaqsAtomically(fixture.database, replacementRecords),
    ).rejects.toThrow("simulated create failure");

    expect(fixture.events).toEqual(["transaction:start", "delete", "create"]);
    expect(fixture.getCommittedRecords()).toEqual(existingRecords);
  });
});
