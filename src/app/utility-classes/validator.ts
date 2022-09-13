export class Validator {
  constructor() {}

  isEmptyString(val: String): boolean {
    return val === '' || val === null || val === undefined;
  }

  isAlphaString(val: String): boolean {
    if (this.isEmptyString(val)) {
      return false;
    } else {
      if (/^[a-zA-Z ]+$/.test(val.toString())) {
        return true;
      } else {
        return false;
      }
    }
  }

  isIntOrFloat(val: String): boolean {
    if (/^[+-]?([0-9]*[.])?[0-9]+$/.test(val.toString())) {
      return true;
    } else {
      return false;
    }
  }

  isIntPositive(val: String): boolean {
    if (/^[0-9]+$/.test(val.toString())) {
      return true;
    } else {
      return false;
    }
  }

  isValidEmail(email: string) {
    let regexExp = /\S+@\S+\.\S+/;
    return regexExp.test(email);
  }

  isNotANumber(num: number) {
    return num == null || num == undefined || num < 0;
  }

  isNotAPostiveNumber(num: number) {
    return num == null || num == undefined || num <= 0;
  }

  isNotNullAndUndefined(num: number) {
    return num != null && num != undefined;
  }
}
