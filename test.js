// const str = "gte price is 100, gteprice is 200";
// const regex = /\bgte\b/g;
// const result = str.replace(regex, "[REPLACED]");
// console.log(result); 
// Output: "[REPLACED] price is 100, gteprice is 200"

// Global scope
// this.foo = 'global scope';

// // Regular function
// function regularFn() {
//   console.log('regularFn => this.foo:', this.foo);
// }

// // Arrow function
// const arrowFn = () => {
//   console.log('arrowFn => this.foo:', this.foo);
// };

// // 1. Gọi trực tiếp trong global scope (strict mode)
// regularFn(); // this = undefined => "regularFn => this.foo: undefined"
// arrowFn();   // this = global scope? Tùy environment, có thể undefined, 
//              // hoặc "global scope" trong non-strict (trình duyệt cũ).

// // 2. Gọi như là method của object
// const obj = {
//   foo: 'obj scope',
//   regularFn: regularFn,
//   arrowFn: arrowFn
// };

// obj.regularFn(); // this = obj => "regularFn => this.foo: obj scope"
// obj.arrowFn();   // arrowFn mượn this từ phạm vi đã định nghĩa (ngoài obj)
//                  // => "arrowFn => this.foo: undefined" (phần lớn trường hợp)
class OuterClass {
    constructor(name) {
      this.name = name;
    }
  
    createInnerClass(value) {
      class InnerClass {
        constructor(val) {
          this.val = val;
        }
  
        // Arrow function property
        arrowMethod = () => {
          console.log(`InnerClass.val = ${this.val}`);
        };
  
        // Method thường
        normalMethod() {
          console.log(`InnerClass.val (normal) = ${this.val}`);
        }
      }
  
      return new InnerClass(value);
    }
  }
  
  const outer = new OuterClass('OuterName');
  const inner = outer.createInnerClass(456);
  
  inner.arrowMethod();  // this = instance của InnerClass
  inner.normalMethod(); // this = instance của InnerClass
  