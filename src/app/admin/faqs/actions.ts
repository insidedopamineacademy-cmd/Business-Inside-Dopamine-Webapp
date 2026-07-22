"use server";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const FAQ_CATEGORIES = new Set(["General", "Services", "Process", "AI", "Pricing"]);
const MAX_FAQ_ID_LENGTH = 128;
const MAX_QUESTION_LENGTH = 500;
const MAX_ANSWER_LENGTH = 5_000;
const MAX_ORDER = 10_000;

type UnknownRecord = Record<string, unknown>;

function getRecord(value: unknown, allowedKeys: readonly string[]) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Invalid FAQ data.");
  }

  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new Error("Invalid FAQ data.");
  }

  const record = value as UnknownRecord;
  if (Object.keys(record).some((key) => !allowedKeys.includes(key))) {
    throw new Error("Invalid FAQ data.");
  }

  return record;
}

function getRequiredText(record: UnknownRecord, key: string, maxLength: number) {
  const value = record[key];
  if (typeof value !== "string") throw new Error("Invalid FAQ data.");

  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength) throw new Error("Invalid FAQ data.");
  return normalized;
}

function getFaqId(value: unknown) {
  if (typeof value !== "string") throw new Error("Invalid FAQ id.");
  const id = value.trim();
  if (!id || id.length > MAX_FAQ_ID_LENGTH) throw new Error("Invalid FAQ id.");
  return id;
}

function getCategory(record: UnknownRecord) {
  const category = getRequiredText(record, "category", 32);
  if (!FAQ_CATEGORIES.has(category)) throw new Error("Invalid FAQ category.");
  return category;
}

function getOrder(record: UnknownRecord) {
  const value = record.order;
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value > MAX_ORDER) {
    throw new Error("Invalid FAQ order.");
  }
  return value;
}

export async function getFAQs() {
  await requireAdmin();

  try {
    return await prisma.faq.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        question: true,
        answer: true,
        category: true,
        isActive: true,
        order: true,
      },
    });
  } catch {
    throw new Error("Failed to fetch FAQs.");
  }
}

export async function createFAQ(data: unknown) {
  await requireAdmin();

  const record = getRecord(data, ["question", "answer", "category", "order"]);
  const question = getRequiredText(record, "question", MAX_QUESTION_LENGTH);
  const answer = getRequiredText(record, "answer", MAX_ANSWER_LENGTH);
  const category = getCategory(record);
  const order = getOrder(record);

  try {
    return await prisma.faq.create({
      data: {
        question,
        answer,
        category,
        order,
      },
      select: { id: true },
    });
  } catch {
    throw new Error("Failed to create FAQ.");
  }
}

export async function updateFAQ(idValue: unknown, data: unknown) {
  await requireAdmin();

  const id = getFaqId(idValue);
  const record = getRecord(data, ["question", "answer", "category", "isActive", "order"]);
  if (Object.keys(record).length === 0) throw new Error("No FAQ changes provided.");

  const updateData: {
    question?: string;
    answer?: string;
    category?: string;
    isActive?: boolean;
    order?: number;
  } = {};

  if (record.question !== undefined) {
    updateData.question = getRequiredText(record, "question", MAX_QUESTION_LENGTH);
  }
  if (record.answer !== undefined) {
    updateData.answer = getRequiredText(record, "answer", MAX_ANSWER_LENGTH);
  }
  if (record.category !== undefined) updateData.category = getCategory(record);
  if (record.isActive !== undefined) {
    if (typeof record.isActive !== "boolean") throw new Error("Invalid FAQ status.");
    updateData.isActive = record.isActive;
  }
  if (record.order !== undefined) updateData.order = getOrder(record);

  try {
    return await prisma.faq.update({
      where: { id },
      data: updateData,
      select: { id: true },
    });
  } catch {
    throw new Error("Failed to update FAQ.");
  }
}

export async function deleteFAQ(idValue: unknown): Promise<{ success: true }> {
  await requireAdmin();

  const id = getFaqId(idValue);

  try {
    await prisma.faq.delete({ where: { id }, select: { id: true } });
    return { success: true };
  } catch {
    throw new Error("Failed to delete FAQ.");
  }
}
