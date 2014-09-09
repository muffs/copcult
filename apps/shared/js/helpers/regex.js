define({
  name: /^.{1,30}$/,
  email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/i,
  phone: /^(1?([-\s]?\d{3})[\s-]?)?(\d{3})([\s-]?\d{4})$/,
  password: /^.{8,32}$/,
  routingNumber: /^[0-9]{9}$/,
  accountNumber: /^[0-9]{4,17}$/,
  zipcode: /^\d{5}(-\d{4})?$/,
  amount: /(?=.)^(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$/
});