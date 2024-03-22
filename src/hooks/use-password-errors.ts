import { useEffect, useState } from 'react';

import { UserSchema } from '../models';

export const usePasswordErrors = (password = '') => {
  const [_password, setPasswordInput] = useState(password);
  const [errors, setErrors] = useState<string[]>([]);

  const getErrors = async () => {
    // ! Display multiple errors for password
    UserSchema.pick({ password: true })
      .safeParseAsync({ password: _password })
      .then((result) => {
        if (!result.success) {
          setErrors(result.error.flatten().fieldErrors.password ?? []);
        } else {
          setErrors([]);
        }
      });
  };

  useEffect(() => {
    if (_password) {
      getErrors();
    }
  }, [_password]);

  return { errors, setPasswordInput };
};
