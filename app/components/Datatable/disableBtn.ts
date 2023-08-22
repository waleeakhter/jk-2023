'use client'
export const disabledBtns = (_btn: HTMLButtonElement, check: boolean) => {
    _btn.disabled = check;
    let nextSibling = _btn.nextElementSibling;
    let prevSibling = _btn.previousElementSibling;
    while (nextSibling) {
        (nextSibling as HTMLButtonElement).disabled = check;
        nextSibling = nextSibling.nextElementSibling;
    }
    while (prevSibling) {
        (prevSibling as HTMLButtonElement).disabled = check;
        prevSibling = prevSibling.previousElementSibling;
    }
}