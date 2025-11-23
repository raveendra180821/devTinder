const s = "qwe123s@dfgAS";
console.log(/[A-Z]/.test(s));
console.log(/[a-z]/.test(s));
console.log(/\d/.test(s));
console.log(/[^A-Za-z0-9]/.test(s));
