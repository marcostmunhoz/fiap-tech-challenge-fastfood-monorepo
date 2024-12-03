db = db.getSiblingDB('payment');
db.createUser({
  user: 'payment',
  pwd: 'secret',
  roles: [
    {
      role: 'readWrite',
      db: 'payment',
    },
  ],
});
