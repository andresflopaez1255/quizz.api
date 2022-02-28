const result =  Number(3*7).toString(2);
let numberBinaries =0

for (let i = 0; i < result.length; i++) {
    if (result[i] === '1') {
        numberBinaries += 1;
    }
}

console.log(numberBinaries)

    