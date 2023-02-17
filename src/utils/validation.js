const Validation = {
  isValidEmail: (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  },
  isValidPhone: (phone) => {
    return String(phone)
      .toLowerCase()
      .match(/(\+?\d[\d -]{8,12}\d)\b/g);
  },
  isInRange: (string, min, max) => {
    return String(string).length >= min && string.length <= max;
  },
  isMinLength: (string, min) => {
    return String(string).length >= min;
  },
  isMaxLength: (string, max) => {
    return String(string).length <= max;
  },
  isEmpty: (string) => {
    return String(string).trim().length === 0;
  },
  isIntegerNumber: (string) => {
    return String(string).match(/^\d+$/);
  },
  isHigherThanZero: (stringNumber) => {
    return Number(stringNumber) > 0;
  },
  isTheSame: (string1, string2) => {
    return string1 === string2;
  },
};

export default Validation;
