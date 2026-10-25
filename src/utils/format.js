export const formatTND = (value) =>
  `${Number(value || 0).toFixed(value && value % 1 === 0 ? 0 : 2)} DT`;

export const formatPrice = formatTND;
