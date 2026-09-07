import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as userService from './userService';

export const useCurrentStudent = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    let active = true;
    if (!user?.id) {
      setStudent(null);
      return;
    }
    userService.getUserById(user.id)
      .then((result) => { if (active) setStudent(result); })
      .catch(() => { if (active) setStudent(user); });
    return () => { active = false; };
  }, [user]);

  return student;
};