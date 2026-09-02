import { revalidatePath } from "next/cache";

const adminRoots = ["/super-admin", "/admin"] as const;

export function revalidateAdminSections(...segments: string[]) {
  for (const root of adminRoots) {
    revalidatePath(root);
    for (const segment of segments) {
      revalidatePath(`${root}/${segment}`);
    }
  }
}
