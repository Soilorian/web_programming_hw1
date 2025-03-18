document.addEventListener("DOMContentLoaded", function () {
    const numberInput = document.getElementById("numberInput");
    const resultOutput = document.getElementById("resultOutput");

    numberInput.addEventListener("input", function () {
        let inputValue = parseFloat(numberInput.value) || 0;
        resultOutput.value = inputValue * 2;
    });
});
