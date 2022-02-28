function getRandomArbitrary(min: number, max:number) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function weightedChoice(weights: number[]) {
    var random = Math.random() * weights[weights.length - 1];
    let i=0;
    for (; i < weights.length; i++)
        if (weights[i] > random)
            break;
    return i;
}
