import { prisma } from "@/lib/prisma";

type Entry = {
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
  ipAddress?: string | null;
};

/**
 * Records a sensitive admin action for the Super Admin activity log.
 * Failures are swallowed so logging never breaks the actual operation.
 */
export async function audit(entry: Entry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: entry.userId ?? null,
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId ?? null,
        metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
        ipAddress: entry.ipAddress ?? null,
      },
    });
  } catch (error) {
    console.error("[audit] could not record action:", error);
  }
}

/** True only for the owner account — the activity log is Super Admin only. */
export function isSuperAdmin(role: string | undefined | null): boolean {
  return role === "OWNER";
}
