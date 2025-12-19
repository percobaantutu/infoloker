export const formatRupiah = (value) => {
  if (!value) return "";

  // Remove non-digits
  const numberString = value.replace(/\D/g, "");

  // Add dot separators
  return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
