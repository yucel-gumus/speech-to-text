import { VoiceNotesApp } from './app';

function initPlaceholders(): void {
    document.querySelectorAll<HTMLElement>('[contenteditable][placeholder]').forEach((el) => {
        const placeholder = el.getAttribute('placeholder')!;

        function updatePlaceholderState() {
            const currentText = (
                el.id === 'polishedNote' ? el.innerText : el.textContent
            )?.trim();

            if (currentText === '' || currentText === placeholder) {
                if (el.id === 'polishedNote' && currentText === '') {
                    el.innerHTML = placeholder;
                } else if (currentText === '') {
                    el.textContent = placeholder;
                }
                el.classList.add('placeholder-active');
            } else {
                el.classList.remove('placeholder-active');
            }
        }

        updatePlaceholderState();

        el.addEventListener('focus', function () {
            const currentText = (
                this.id === 'polishedNote' ? this.innerText : this.textContent
            )?.trim();
            if (currentText === placeholder) {
                if (this.id === 'polishedNote') this.innerHTML = '';
                else this.textContent = '';
                this.classList.remove('placeholder-active');
            }
        });

        el.addEventListener('blur', function () {
            updatePlaceholderState();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    new VoiceNotesApp();
    initPlaceholders();
});

export { };
