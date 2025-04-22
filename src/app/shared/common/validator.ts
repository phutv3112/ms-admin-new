import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function discountDateValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;

    if (!startDate || !endDate) return null;
    const now = new Date();

    if (new Date(startDate) >= new Date(endDate)) {
      return { startAfterEnd: true };
    }

    if (new Date(startDate) < now) {
      return { startBeforeNow: true };
    }

    return null;
  };
}

export function discountUpdateDateValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;

    if (!startDate || !endDate) return null;

    if (new Date(startDate) >= new Date(endDate)) {
      return { startAfterEnd: true };
    }

    return null;
  };
}

export function percentageMaxDiscountValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const type = control.get('type')?.value;
    const minSubtotal = control.get('minSubtotal')?.value;
    const value = control.get('value')?.value;
    const maxDiscount = control.get('maxDiscountAmount')?.value;

    if (type === 0 && minSubtotal && value && maxDiscount != null) {
      const calculated = (minSubtotal * value) / 100;
      if (maxDiscount >= calculated) {
        return { maxDiscountExceeded: true };
      }
    }

    return null;
  };
}

export function fixedMaxDiscountValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const type = control.get('type')?.value;
    const minSubtotal = control.get('minSubtotal')?.value;
    const value = control.get('value')?.value;

    if (type === 1 && minSubtotal && value) {
      if (value > minSubtotal) {
        return { maxFixedDiscountExceeded: true };
      }
    }

    return null;
  };
}

export function perUserLimitDiscountValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const usageLimit = control.get('usageLimit')?.value;
    const perUserLimit = control.get('perUserLimit')?.value;

    if (usageLimit && perUserLimit) {
      if (perUserLimit > usageLimit) {
        return { maxPerUserExceeded: true };
      }
    }
    return null;
  };
}

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasDigit = /[0-9]/.test(value);

    const errors: ValidationErrors = {};
    if (!hasUpperCase) {
      errors['passwordRequiresUpper'] =
        'Password must have at least one uppercase letter.';
    }
    if (!hasDigit) {
      errors['passwordRequiresDigit'] =
        'Password must have at least one digit.';
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };
}
