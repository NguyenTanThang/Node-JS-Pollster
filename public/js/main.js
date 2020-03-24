const generateRandomColor = () => {
    const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
    const randomByte = () => randomNumber(0, 255)
    const randomPercent = () => (randomNumber(50, 100) * 0.01).toFixed(2)
    const randomCssRgba = () => `rgba(${[randomByte(), randomByte(), randomByte(), randomPercent()].join(',')})`
    const boldRandomCssRgba = () => `rgba(${[randomByte(), randomByte(), randomByte(), 1].join(',')})`

    return [randomCssRgba, boldRandomCssRgba]
}