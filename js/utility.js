const reg = /[&<>"'/`]/gi;

export const sanitizeInput = (value) => {
  return value.replace(reg, "").trim();
};
