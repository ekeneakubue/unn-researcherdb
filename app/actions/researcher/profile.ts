"use server";

import { revalidatePath } from "next/cache";
import { requireResearcherSession } from "@/lib/auth/require-researcher";
import { prisma } from "@/lib/prisma";
import { uploadProfileImage } from "@/lib/r2";
import { runSafeAction } from "@/lib/safe-action";

export async function updateResearcherPhotoAction(photoFile: File) {
  return runSafeAction("Update profile photo", async () => {
    const session = await requireResearcherSession();
    const uploaded = await uploadProfileImage(photoFile);

    const researcher = await prisma.researcher.update({
      where: { id: session.researcherId },
      data: { photoUrl: uploaded.url },
      select: {
        reference: true,
        id: true,
        photoUrl: true,
      },
    });

    revalidatePath("/researcher");
    revalidatePath("/researcher/profile");

    return {
      id: researcher.reference ?? researcher.id,
      photoUrl: researcher.photoUrl,
    };
  });
}
