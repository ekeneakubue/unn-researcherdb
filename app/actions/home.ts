"use server";

import { getHomeEquipmentDetail, getHomeResearchDetail } from "@/lib/home";
import { runSafeAction, type SafeActionResult } from "@/lib/safe-action";
import type { HomeEquipmentDetail, HomeResearchDetail } from "@/lib/home-shared";

export async function getHomeResearchDetailAction(
  identifier: string,
): Promise<SafeActionResult<HomeResearchDetail | null>> {
  return runSafeAction("Research details", async () => getHomeResearchDetail(identifier));
}

export async function getHomeEquipmentDetailAction(
  identifier: string,
): Promise<SafeActionResult<HomeEquipmentDetail | null>> {
  return runSafeAction("Equipment details", async () => getHomeEquipmentDetail(identifier));
}
