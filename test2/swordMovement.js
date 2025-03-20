document.addEventListener('DOMContentLoaded', () => {
    const leftSword = document.getElementById('leftSword');
    const rightSword = document.getElementById('rightSword');
    const inputContainer = document.getElementById('inputContainer');

    setTimeout(() => {
        leftSword.classList.add('animate');
        rightSword.classList.add('animate');

        setTimeout(() => {
            leftSword.classList.add('move-up');
            rightSword.classList.add('move-up');
            setTimeout(() => {
                inputContainer.classList.add('show');
            }, 200);
        }, 1500);
    }, 500);
});
