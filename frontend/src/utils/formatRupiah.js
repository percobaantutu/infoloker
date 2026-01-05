export const formatRupiah = (value) => {
  if (!value) return "";

  // Convert to string first, then remove non-digits
  const numberString = String(value).replace(/\D/g, "");

  // Add dot separators
  return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
