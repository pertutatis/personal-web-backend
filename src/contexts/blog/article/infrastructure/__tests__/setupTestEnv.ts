Object.defineProperty(process.env, 'NODE_ENV', { value: 'test', writable: true });
process.env.BLOG_DB_NAME = 'test_articles';
// Puedes añadir más variables si lo necesitas 
