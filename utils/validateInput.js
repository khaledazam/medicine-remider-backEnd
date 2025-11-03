
/**
 * فحص الحقول المطلوبة قبل تنفيذ العملية
 * @param {object} fields - الكائن اللي فيه كل الحقول اللي عايز تفحصها
 * @returns {object} - نتيجة الفحص
 */
export const validateInput = (fields) => {
  const errors = [];

  Object.entries(fields).forEach(([key, value]) => {
    if (!value || value.toString().trim() === "") {
      errors.push(`${key} is required`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};
