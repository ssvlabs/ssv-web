import { proxy, useSnapshot } from "valtio";
import { createClient } from "@supabase/supabase-js";
import { useLocalStorage } from "react-use";

const MAINTENANCE_ROW_ID = "ssv-web";
const MAINTENANCE_STORAGE_KEY = "__maintenance-live";

type MaintenanceRow = {
  id: string;
  active?: boolean;
};
export const maintenanceProxy = proxy({
  isActive: readMaintenanceFromStorage(),
});

function setMaintenanceState(next: boolean) {
  const prev = maintenanceProxy.isActive;
  maintenanceProxy.isActive = next;
  writeMaintenanceToStorage(next);
  if (prev && !next && typeof window !== "undefined") {
    window.location.reload();
  }
}

function applyMaintenanceRow(row: MaintenanceRow | null) {
  console.log("row:", row);
  setMaintenanceState(row?.active ?? false);
}

function readMaintenanceFromStorage(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(MAINTENANCE_STORAGE_KEY);
    if (raw === null) return false;
    return raw !== "false";
  } catch {
    return false;
  }
}

function writeMaintenanceToStorage(isActive: boolean) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MAINTENANCE_STORAGE_KEY, String(isActive));
  } catch {
    // quota / private mode
  }
}

try {
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL || "",
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "",
  );

  supabase
    .from("maintenance")
    .select("*")
    .eq("id", MAINTENANCE_ROW_ID)
    .maybeSingle()
    .then(({ data, error }) => {
      if (error) return;
      applyMaintenanceRow(data as MaintenanceRow | null);
    });

  supabase
    .channel("maintenance-realtime")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "maintenance",
        filter: `id=eq.${MAINTENANCE_ROW_ID}`,
      },
      (payload) => {
        if (payload.eventType === "DELETE") {
          setMaintenanceState(false);
          return;
        }
        applyMaintenanceRow(payload.new as MaintenanceRow);
      },
    )
    .subscribe();
  console.log("Supabase maintenance initialized");
} catch (error) {
  console.error("Error initializing Supabase maintenance:", error);
}

/** Live flag from Supabase — applies to all users unless bypass is set. */
const BYPASS_KEY = "bypassMaintenance";
console.log("BYPASS_KEY:", BYPASS_KEY);

export const useMaintenance = () => {
  const isLiveMaintenance = useSnapshot(maintenanceProxy).isActive;

  const [bypassMaintenance] = useLocalStorage(BYPASS_KEY, false, {
    raw: false,
    deserializer: (value) => value === "true",
    serializer: (value) => String(value),
  });

  return { isMaintenancePage: isLiveMaintenance && !bypassMaintenance };
};
