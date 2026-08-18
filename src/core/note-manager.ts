import DOMPurify from 'dompurify';
import type { Note } from '../types';
import { downloadTextFile } from '../utils/dom';

export class NoteManager {
    private currentNote: Note | null = null;
    private rawTranscription: HTMLDivElement;
    private polishedNote: HTMLDivElement;
    private editorTitle: HTMLDivElement;

    constructor(
        rawTranscription: HTMLDivElement,
        polishedNote: HTMLDivElement,
        editorTitle: HTMLDivElement
    ) {
        this.rawTranscription = rawTranscription;
        this.polishedNote = polishedNote;
        this.editorTitle = editorTitle;
    }

    createNew(): Note {
        this.currentNote = {
            id: `note_${Date.now()}`,
            rawTranscription: '',
            polishedNote: '',
            timestamp: Date.now(),
        };

        this.resetUI();
        return this.currentNote;
    }

    getCurrent(): Note | null {
        return this.currentNote;
    }

    setRawTranscription(text: string): void {
        if (this.currentNote) {
            this.currentNote.rawTranscription = text;
        }
        this.rawTranscription.textContent = text;
        this.updatePlaceholderState(this.rawTranscription, text);
    }

    setPolishedNote(html: string, rawText: string): void {
        if (this.currentNote) {
            this.currentNote.polishedNote = rawText;
        }
        const cleanHtml = DOMPurify.sanitize(html, {
            USE_PROFILES: { html: true },
        });
        this.polishedNote.innerHTML = cleanHtml;
        this.updatePlaceholderState(this.polishedNote, rawText);
        this.extractAndSetTitle(rawText);
    }

    download(activeTab: string): void {
        const rawTitle = this.editorTitle.textContent?.trim() || '';
        const placeholder = this.editorTitle.getAttribute('placeholder') || '';
        const hasCustomTitle = rawTitle && rawTitle !== placeholder;
        const sanitizedTitle = hasCustomTitle
            ? rawTitle.replace(/[^\w\s\u00C0-\u017F-]/gi, '').trim().replace(/\s+/g, '_').toLowerCase()
            : 'sesli_not';

        let content = '';
        let filename = `${sanitizedTitle}.txt`;

        if (activeTab === 'note') {
            content = this.currentNote?.polishedNote || this.polishedNote.innerText || '';
            filename = `${sanitizedTitle}.md`;
        } else {
            content = this.currentNote?.rawTranscription || this.rawTranscription.innerText || '';
            filename = `${sanitizedTitle}_ham.txt`;
        }

        downloadTextFile(content, filename);
    }

    private resetUI(): void {
        const rawPlaceholder = this.rawTranscription.getAttribute('placeholder') || '';
        this.rawTranscription.textContent = rawPlaceholder;
        this.rawTranscription.classList.add('placeholder-active');

        const polishedPlaceholder = this.polishedNote.getAttribute('placeholder') || '';
        this.polishedNote.innerHTML = polishedPlaceholder;
        this.polishedNote.classList.add('placeholder-active');

        const titlePlaceholder = this.editorTitle.getAttribute('placeholder') || 'Untitled Note';
        this.editorTitle.textContent = titlePlaceholder;
        this.editorTitle.classList.add('placeholder-active');
    }

    private updatePlaceholderState(element: HTMLElement, text: string): void {
        if (text.trim() !== '') {
            element.classList.remove('placeholder-active');
        } else {
            const placeholder = element.getAttribute('placeholder') || '';
            if (element.id === 'polishedNote') {
                element.innerHTML = placeholder;
            } else {
                element.textContent = placeholder;
            }
            element.classList.add('placeholder-active');
        }
    }

    private extractAndSetTitle(polishedText: string): void {
        const lines = polishedText.split('\n').map((l) => l.trim());
        let titleSet = false;

        for (const line of lines) {
            if (line.startsWith('#')) {
                const title = line.replace(/^#+\s+/, '').trim();
                if (title) {
                    this.editorTitle.textContent = title;
                    this.editorTitle.classList.remove('placeholder-active');
                    titleSet = true;
                    break;
                }
            }
        }

        if (!titleSet) {
            for (const line of lines) {
                if (line.length > 0) {
                    let potentialTitle = line.replace(/^[\*_\`#\->\s\[\]\(.\d)]+/, '');
                    potentialTitle = potentialTitle.replace(/[\*_\`#]+$/, '').trim();

                    if (potentialTitle.length > 3) {
                        const maxLength = 60;
                        this.editorTitle.textContent =
                            potentialTitle.substring(0, maxLength) +
                            (potentialTitle.length > maxLength ? '...' : '');
                        this.editorTitle.classList.remove('placeholder-active');
                        titleSet = true;
                        break;
                    }
                }
            }
        }

        if (!titleSet) {
            const placeholder = this.editorTitle.getAttribute('placeholder') || 'Untitled Note';
            this.editorTitle.textContent = placeholder;
            this.editorTitle.classList.add('placeholder-active');
        }
    }
}
