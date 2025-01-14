import { refresh } from "../api/auth";

export async function handleRefresh() {
  try {
    await refresh();
    console.log("vse ok!");
  } catch (error) {
    console.error("Error while updating token!!!!!:", error);
    throw error;
  }
}
