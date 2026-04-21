"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isLeadStatus } from "@/lib/leads";

function getField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function updateLead(formData: FormData) {
  const id = getField(formData, "id");
  const status = getField(formData, "status");

  if (!id || !isLeadStatus(status)) return;

  const meetingBooked = formData.get("meetingBooked") === "on";
  const meetingDateRaw = getField(formData, "meetingDate");
  const meetingNotesRaw = getField(formData, "meetingNotes");

  await prisma.lead.update({
    where: { id },
    data: {
      status,
      meetingBooked,
      meetingDate: meetingDateRaw || null,
      meetingNotes: meetingNotesRaw || null,
    },
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
}

export async function archiveLead(formData: FormData) {
  const id = getField(formData, "id");
  if (!id) return;

  await prisma.lead.update({
    where: { id },
    data: { archived: true },
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
}

export async function unarchiveLead(formData: FormData) {
  const id = getField(formData, "id");
  if (!id) return;

  await prisma.lead.update({
    where: { id },
    data: { archived: false },
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
}
