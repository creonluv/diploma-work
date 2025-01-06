import { refresh } from "../api/auth";

export async function handleRefresh() {
  try {
    await refresh();
  } catch (error) {
    console.error("Error while updating token!!!!!:", error);
    throw error;
  }
}
