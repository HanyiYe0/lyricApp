var start = Date.now()
setTimeout(() => {
    start = Date.now()
}, 1000)
setTimeout(() => {
    console.log(Date.now() - start)
}, 2000)

console.log(Date.now())
