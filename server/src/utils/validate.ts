import { FieldError } from './../resolvers/user';
import { UserInput } from './../types/inputType';

const validateEmail = (email: string) => {
  return /\S+@\S+\.\S+/.test(email);
};

const validateUsername = (username: string) => {
  return /^[a-zA-Z0-9]([a-zA-Z0-9_])+$/.test(username);
};

const validateLength = (field: string) => {
  return field.length > 3;
};

export const validateRegister = (input: UserInput): FieldError[] | null => {
  let errors = [];

  if (!validateEmail(input.email)) {
    errors.push({
      field: 'Email',
      message: 'Not a valid email',
    });
  }

  if (!validateUsername(input.username)) {
    errors.push({
      field: 'Username',
      message: 'Not a valid username',
    });
  }

  if (!validateLength(input.username)) {
    errors.push({
      field: 'Username',
      message: 'Length must greater than 3',
    });
  }

  if (!validateLength(input.password)) {
    errors.push({
      field: 'Password',
      message: 'Length must greater than 3',
    });
  }

  if (errors.length > 0) {
    return errors;
  } else {
    return null;
  }
};
