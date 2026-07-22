"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { isLeadStatus } from "@/lib/leads";

const MAX_LEAD_ID_LENGTH = 128;
const MAX_MEETING_NOTES_LENGTH = 2_000;

function getStringField(formData: FormData, key: string) {
  const value = formData.get(key);
  if (value === null) return "";
  if (typeof value !== "string") throw new Error("Invalid lead update.");
  return value.trim();
}

function getLeadId(formData: FormData) {
  const id = getStringField(formData, "id");
  if (!id || id.length > MAX_LEAD_ID_LENGTH) throw new Error("Invalid lead update.");
  return id;
}

function getMeetingDate(formData: FormData) {
  const value = getStringField(formData, "meetingDate");
  if (!value) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("Invalid meeting date.");

  const parsedDate = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsedDate.valueOf()) || parsedDate.toISOString().slice(0, 10) !== value) {
    throw new Error("Invalid meeting date.");
  }

  return value;
}

function getMeetingNotes(formData: FormData) {
  const value = getStringField(formData, "meetingNotes");
  if (value.length > MAX_MEETING_NOTES_LENGTH) throw new Error("Meeting notes are too long.");
  return value || null;
}

export async function updateLead(formData: FormData) {
  await requireAdmin();

  const id = getLeadId(formData);
  const status = getStringField(formData, "status");
  if (!isLeadStatus(status)) throw new Error("Invalid lead status.");

  const meetingBooked = formData.get("meetingBooked") === "on";
  const meetingDate = getMeetingDate(formData);
  const meetingNotes = getMeetingNotes(formData);

  try {
    await prisma.lead.update({
      where: { id },
      data: {
        status,
        meetingBooked,
        meetingDate,
        meetingNotes,
      },
      select: { id: true },
    });
  } catch {
    throw new Error("Unable to update lead.");
  }

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
}

export async function archiveLead(formData: FormData) {
  await requireAdmin();

  const id = getLeadId(formData);

  try {
    await prisma.lead.update({
      where: { id },
      data: { archived: true },
      select: { id: true },
    });
  } catch {
    throw new Error("Unable to update lead.");
  }

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
}

export async function unarchiveLead(formData: FormData) {
  await requireAdmin();

  const id = getLeadId(formData);

  try {
    await prisma.lead.update({
      where: { id },
      data: { archived: false },
      select: { id: true },
    });
  } catch {
    throw new Error("Unable to update lead.");
  }

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
}
