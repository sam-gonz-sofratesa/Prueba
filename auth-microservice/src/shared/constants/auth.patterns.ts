export const AUTH_PATTERNS = {
  LOGIN:    'auth.login',
  REGISTER: 'auth.register',
  REFRESH:  'auth.refresh',
  VALIDATE: 'auth.validate', // usado por el guard del gateway para proteger rutas
} as const;
