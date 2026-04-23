"use server";

import { prisma } from "@/lib/prisma";
import type { Faq } from "@prisma/client";

export async function getFAQs(): Promise<Faq[]> {
  try {
    return await prisma.faq.findMany({ orderBy: { order: "asc" } });
  } catch (err) {
    console.error("[getFAQs]", err);
    throw new Error("Failed to fetch FAQs.");
  }
}

export async function createFAQ(data: {
  question: string;
  answer: string;
  category: string;
  order: number;
}): Promise<Faq> {
  if (!data.question.trim()) throw new Error("Question is required.");
  if (!data.answer.trim()) throw new Error("Answer is required.");
  if (!data.category.trim()) throw new Error("Category is required.");

  try {
    return await prisma.faq.create({
      data: {
        question: data.question.trim(),
        answer: data.answer.trim(),
        category: data.category.trim(),
        order: data.order,
      },
    });
  } catch (err) {
    console.error("[createFAQ]", err);
    throw new Error("Failed to create FAQ.");
  }
}

export async function updateFAQ(
  id: string,
  data: Partial<{
    question: string;
    answer: string;
    category: string;
    isActive: boolean;
    order: number;
  }>
): Promise<Faq> {
  if (!id.trim()) throw new Error("FAQ id is required.");
  if (data.question !== undefined && !data.question.trim())
    throw new Error("Question cannot be empty.");
  if (data.answer !== undefined && !data.answer.trim())
    throw new Error("Answer cannot be empty.");
  if (data.category !== undefined && !data.category.trim())
    throw new Error("Category cannot be empty.");

  try {
    return await prisma.faq.update({
      where: { id },
      data: {
        ...(data.question !== undefined && { question: data.question.trim() }),
        ...(data.answer !== undefined && { answer: data.answer.trim() }),
        ...(data.category !== undefined && { category: data.category.trim() }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.order !== undefined && { order: data.order }),
      },
    });
  } catch (err) {
    console.error("[updateFAQ]", err);
    throw new Error("Failed to update FAQ.");
  }
}

export async function deleteFAQ(id: string): Promise<{ success: true }> {
  if (!id.trim()) throw new Error("FAQ id is required.");

  try {
    await prisma.faq.delete({ where: { id } });
    return { success: true };
  } catch (err) {
    console.error("[deleteFAQ]", err);
    throw new Error("Failed to delete FAQ.");
  }
}
