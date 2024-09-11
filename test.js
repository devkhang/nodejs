const str = "gte price is 100, gteprice is 200";
const regex = /\bgte\b/g;
const result = str.replace(regex, "[REPLACED]");
console.log(result); 
// Output: "[REPLACED] price is 100, gteprice is 200"
