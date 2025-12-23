export class RecordingUI {
    private recordingInterface: HTMLDivElement;
    private liveRecordingTitle: HTMLDivElement;
    private liveWaveformCanvas: HTMLCanvasElement | null;
    private liveRecordingTimerDisplay: HTMLDivElement;
    private statusIndicatorDiv: HTMLDivElement | null;
    private recordButton: HTMLButtonElement;
    private recordingStatus: HTMLDivElement;
    private editorTitle: HTMLDivElement;
    private newButton: HTMLButtonElement;
    private downloadButton: HTMLButtonElement;

    constructor(
        recordingInterface: HTMLDivElement,
        liveRecordingTitle: HTMLDivElement,
        liveWaveformCanvas: HTMLCanvasElement | null,
        liveRecordingTimerDisplay: HTMLDivElement,
        recordButton: HTMLButtonElement,
        recordingStatus: HTMLDivElement,
        editorTitle: HTMLDivElement,
        newButton: HTMLButtonElement,
        downloadButton: HTMLButtonElement
    ) {
        this.recordingInterface = recordingInterface;
        this.liveRecordingTitle = liveRecordingTitle;
        this.liveWaveformCanvas = liveWaveformCanvas;
        this.liveRecordingTimerDisplay = liveRecordingTimerDisplay;
        this.recordButton = recordButton;
        this.recordingStatus = recordingStatus;
        this.editorTitle = editorTitle;
        this.newButton = newButton;
        this.downloadButton = downloadButton;

        this.statusIndicatorDiv = recordingInterface.querySelector('.status-indicator');
    }


    showLiveMode(): void {
        this.recordingInterface.classList.add('is-live');
        this.liveRecordingTitle.style.display = 'block';
        if (this.liveWaveformCanvas) {
            this.liveWaveformCanvas.style.display = 'block';
        }
        this.liveRecordingTimerDisplay.style.display = 'block';

        if (this.statusIndicatorDiv) {
            this.statusIndicatorDiv.style.display = 'none';
        }

        const iconElement = this.recordButton.querySelector('.record-button-inner i') as HTMLElement;
        if (iconElement) {
            iconElement.classList.remove('fa-microphone');
            iconElement.classList.add('fa-stop');
        }

        this.updateLiveTitle();
    }

    hideLiveMode(): void {
        this.recordingInterface.classList.remove('is-live');
        this.liveRecordingTitle.style.display = 'none';
        if (this.liveWaveformCanvas) {
            this.liveWaveformCanvas.style.display = 'none';
        }
        this.liveRecordingTimerDisplay.style.display = 'none';

        if (this.statusIndicatorDiv) {
            this.statusIndicatorDiv.style.display = 'block';
        }

        const iconElement = this.recordButton.querySelector('.record-button-inner i') as HTMLElement;
        if (iconElement) {
            iconElement.classList.remove('fa-stop');
            iconElement.classList.add('fa-microphone');
        }
    }

    setRecordingState(isRecording: boolean): void {
        if (isRecording) {
            this.recordButton.classList.add('recording');
            this.recordButton.setAttribute('title', 'Stop Recording');
        } else {
            this.recordButton.classList.remove('recording');
            this.recordButton.setAttribute('title', 'Start Recording');
        }
    }

    setStatus(message: string): void {
        this.recordingStatus.textContent = message;
    }

    showProcessing(): void {
        this.recordButton.classList.add('processing');
        this.recordButton.disabled = true;
        this.newButton.disabled = true;
        this.downloadButton.disabled = true;

        const iconElement = this.recordButton.querySelector('.record-button-inner i') as HTMLElement;
        if (iconElement) {
            iconElement.classList.remove('fa-microphone', 'fa-stop');
            iconElement.classList.add('fa-spinner', 'fa-spin');
        }
    }

    hideProcessing(): void {
        this.recordButton.classList.remove('processing');
        this.recordButton.disabled = false;
        this.newButton.disabled = false;
        this.downloadButton.disabled = false;

        const iconElement = this.recordButton.querySelector('.record-button-inner i') as HTMLElement;
        if (iconElement) {
            iconElement.classList.remove('fa-spinner', 'fa-spin');
            iconElement.classList.add('fa-microphone');
        }
    }

    private updateLiveTitle(): void {
        const currentTitle = this.editorTitle.textContent?.trim();
        const placeholder = this.editorTitle.getAttribute('placeholder') || 'Untitled Note';
        this.liveRecordingTitle.textContent =
            currentTitle && currentTitle !== placeholder ? currentTitle : 'New Recording';
    }
}
