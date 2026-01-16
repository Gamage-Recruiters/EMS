export const getMyAvailability = async () => {
  return { status: "AVAILABLE" };
};

export const setAvailability = async (status) => {
  console.log("Availability set to:", status);
  return { success: true };
};