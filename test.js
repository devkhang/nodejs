// const str = "gte price is 100, gteprice is 200";
// const regex = /\bgte\b/g;
// const result = str.replace(regex, "[REPLACED]");
// console.log(result); 
// Output: "[REPLACED] price is 100, gteprice is 200"

const fn = (name)=>{
    console.log(`hello ${name}`);
}

const fn2 = (fn1,name,message)=>{
    fn1(name);
    console.log(message)
}

fn2(fn,'khang','how are you going');