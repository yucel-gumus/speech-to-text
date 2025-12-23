import { marked } from 'marked';
import type { DOMElements } from './types';
import { getElementById, getElement } from './utils/dom';
import { AIService } from './services/ai.service';
import { AudioService } from './services/audio.service';
import { ThemeService } from './services/theme.service';
import { WaveformVisualizer } from './core/waveform';
import { RecordingTimer } from './core/timer';
import { NoteManager } from './core/note-manager';
import { RecordingUI } from './core/recording-ui';
import { blobToBase64 } from './utils/audio';

export class VoiceNotesApp {
    private elements: DOMElements;
    private aiService: AIService;
    private audioService: AudioService;
    private themeService: ThemeService;
    private waveform: WaveformVisualizer | null = null;
    private timer: RecordingTimer;
    private noteManager: NoteManager;
    private recordingUI: RecordingUI;
    private isRecording = false;

    constructor() {
        this.elements = this.initElements();
        this.aiService = new AIService();
        this.audioService = new AudioService();
        this.themeService = new ThemeService(this.elements.themeToggleIcon);

        this.timer = new RecordingTimer(this.elements.liveRecordingTimerDisplay);
        this.noteManager = new NoteManager(
            this.elements.rawTranscription,
            this.elements.polishedNote,
            this.elements.editorTitle
        );
        this.recordingUI = new RecordingUI(
            this.elements.recordingInterface,
            this.elements.liveRecordingTitle,
            this.elements.liveWaveformCanvas,
            this.elements.liveRecordingTimerDisplay,
            this.elements.recordButton,
            this.elements.recordingStatus,
            this.elements.editorTitle,
            this.elements.newButton,
            this.elements.downloadNoteButton
        );

        if (this.elements.liveWaveformCanvas) {
            this.waveform = new WaveformVisualizer(this.elements.liveWaveformCanvas);
        }

        this.init();
    }

    private initElements(): DOMElements {
        return {
            recordButton: getElementById<HTMLButtonElement>('recordButton'),
            recordingStatus: getElementById<HTMLDivElement>('recordingStatus'),
            rawTranscription: getElementById<HTMLDivElement>('rawTranscription'),
            polishedNote: getElementById<HTMLDivElement>('polishedNote'),
            newButton: getElementById<HTMLButtonElement>('newButton'),
            themeToggleButton: getElementById<HTMLButtonElement>('themeToggleButton'),
            themeToggleIcon: document.querySelector('#themeToggleButton i') as HTMLElement,
            editorTitle: getElement<HTMLDivElement>('.editor-title'),
            recordingInterface: getElement<HTMLDivElement>('.recording-interface'),
            liveRecordingTitle: getElementById<HTMLDivElement>('liveRecordingTitle'),
            liveWaveformCanvas: document.getElementById('liveWaveformCanvas') as HTMLCanvasElement | null,
            liveRecordingTimerDisplay: getElementById<HTMLDivElement>('liveRecordingTimerDisplay'),
            statusIndicatorDiv: document.querySelector('.recording-interface .status-indicator') as HTMLDivElement | null,
            downloadNoteButton: getElementById<HTMLButtonElement>('downloadNoteButton'),
            languageSelect: getElementById<HTMLSelectElement>('languageSelect'),
        };
    }

    private init(): void {
        this.bindEvents();
        this.themeService.init();
        this.noteManager.createNew();
        this.recordingUI.setStatus('Kayıt için hazır');
    }

    private bindEvents(): void {
        this.elements.recordButton.addEventListener('click', () => this.toggleRecording());
        this.elements.newButton.addEventListener('click', () => this.createNewNote());
        this.elements.themeToggleButton.addEventListener('click', () => {
            console.log('Theme toggle clicked');
            this.themeService.toggle();
        });
        this.elements.downloadNoteButton.addEventListener('click', () => this.downloadNote());
        window.addEventListener('resize', () => this.handleResize());
    }

    private handleResize(): void {
        if (this.isRecording && this.waveform) {
            requestAnimationFrame(() => this.waveform?.setupDimensions());
        }
    }

    private async toggleRecording(): Promise<void> {
        if (!this.isRecording) {
            await this.startRecording();
        } else {
            await this.stopRecording();
        }
    }

    private async startRecording(): Promise<void> {
        try {
            this.recordingUI.setStatus('Mikrofon erişimi isteniyor...');
            const stream = await this.audioService.requestMicrophone();

            this.audioService.createRecorder(
                () => { },
                () => this.handleRecordingStop()
            );

            this.audioService.start();
            this.isRecording = true;

            this.recordingUI.setRecordingState(true);
            this.recordingUI.showLiveMode();

            if (this.waveform) {
                this.waveform.setupDimensions();
                this.waveform.init(stream);
                this.waveform.start();
            }

            this.timer.start();
        } catch (error) {
            this.handleRecordingError(error);
        }
    }

    private async stopRecording(): Promise<void> {
        if (!this.isRecording) return;

        this.audioService.stop();
        this.isRecording = false;
        this.recordingUI.setRecordingState(false);
        this.recordingUI.setStatus('Ses işleniyor...');
    }

    private handleRecordingStop(): void {
        this.timer.stop();
        this.waveform?.stop();
        this.recordingUI.hideLiveMode();
        this.waveform?.destroy();

        const audioBlob = this.audioService.getAudioBlob();
        if (audioBlob && audioBlob.size > 0) {
            this.processAudio(audioBlob);
        } else {
            this.recordingUI.setStatus('Ses verisi yakalanamadı. Lütfen tekrar deneyin.');
        }

        this.audioService.releaseStream();
    }

    private async processAudio(audioBlob: Blob): Promise<void> {
        this.recordingUI.showProcessing();

        try {
            this.recordingUI.setStatus('Ses dönüştürülüyor...');
            const base64Audio = await blobToBase64(audioBlob);
            const mimeType = this.audioService.getMimeType();

            this.recordingUI.setStatus('Transkripsiyon alınıyor...');
            const langCode = this.getSelectedLanguage();
            const transcription = await this.aiService.transcribe(base64Audio, mimeType, langCode);

            if (transcription) {
                this.noteManager.setRawTranscription(transcription);
                this.recordingUI.setStatus('Transkripsiyon tamamlandı. Not düzenleniyor...');
                await this.polishNote(transcription);
            } else {
                this.recordingUI.setStatus('Transkripsiyon başarısız oldu veya boş döndü.');
            }
        } catch (error) {
            console.error('Error processing audio:', error);
            this.recordingUI.setStatus('Kayıt işlenirken hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            this.recordingUI.hideProcessing();
        }
    }

    private async polishNote(rawTranscription: string): Promise<void> {
        try {
            this.recordingUI.setStatus('Not düzenleniyor...');
            const langCode = this.getSelectedLanguage();
            const polishedText = await this.aiService.polish(rawTranscription, langCode);

            if (polishedText) {
                const htmlContent = marked.parse(polishedText);
                this.noteManager.setPolishedNote(htmlContent as string, polishedText);
                this.recordingUI.setStatus('Not düzenlendi. Yeni kayıt için hazır.');
            } else {
                this.recordingUI.setStatus('Düzenleme başarısız oldu veya boş döndü.');
            }
        } catch (error) {
            console.error('Error polishing note:', error);
            this.recordingUI.setStatus('Not düzenlenirken hata oluştu. Lütfen tekrar deneyin.');
        }
    }

    private handleRecordingError(error: unknown): void {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorName = error instanceof Error ? error.name : 'Unknown';

        let statusMessage = `Hata: ${errorMessage}`;

        if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
            statusMessage = 'Mikrofon izni reddedildi. Tarayıcı ayarlarını kontrol edip sayfayı yenileyin.';
        } else if (errorName === 'NotFoundError') {
            statusMessage = 'Mikrofon bulunamadı. Lütfen bir mikrofon bağlayın.';
        } else if (errorName === 'NotReadableError' || errorName === 'AbortError') {
            statusMessage = 'Mikrofona erişilemiyor. Başka bir uygulama tarafından kullanılıyor olabilir.';
        }

        this.recordingUI.setStatus(statusMessage);
        this.isRecording = false;
        this.audioService.reset();
        this.recordingUI.setRecordingState(false);
        this.recordingUI.hideLiveMode();
        this.waveform?.destroy();
    }

    private createNewNote(): void {
        this.noteManager.createNew();
        this.recordingUI.setStatus('Kayıt için hazır');

        if (this.isRecording) {
            this.audioService.stop();
            this.isRecording = false;
            this.recordingUI.setRecordingState(false);
            this.recordingUI.hideLiveMode();
        }
    }

    private downloadNote(): void {
        const activeTab = document.querySelector('.tab-button.active') as HTMLElement;
        const tabName = activeTab?.getAttribute('data-tab') || 'note';
        this.noteManager.download(tabName);
    }

    private getSelectedLanguage(): string {
        return this.elements.languageSelect.value || 'tr';
    }
}
