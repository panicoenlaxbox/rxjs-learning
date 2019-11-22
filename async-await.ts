setInterval(() => {
    console.log('interval');
}, 1000);

let p = new Promise<number>(resolve => {
    setTimeout(() => {
        resolve(1);
    }, 5000);
});

async function foo() {
    const v = await p;
    return v;
}

(async () => {
    console.log('await');
    const f = await foo();
    console.log('resume');
    console.log(f); // 1
})();

  // await
  // interval
  // interval
  // interval
  // interval
  // resume
  // 1
  // interval
  // interval
  // ...