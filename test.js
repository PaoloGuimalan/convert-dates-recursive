import convertDatesRecursive from "./index.js";

console.log(
  convertDatesRecursive(
    {
      birth_date: "05/14/2001",
      nested: {
        birth_date: "05/14/2001",
      },
    },
    ["birth_date"],
    "YYYY-MM-DD"
  )
);
