export interface Note {
    id: string;
    rawTranscription: string;
    polishedNote: string;
    timestamp: number;
}

export type ThemeMode = 'light' | 'dark';

export type RecordingState = 'idle' | 'recording' | 'processing';

export interface DOMElements {
    recordButton: HTMLButtonElement;
    recordingStatus: HTMLDivElement;
    rawTranscription: HTMLDivElement;
    polishedNote: HTMLDivElement;
    newButton: HTMLButtonElement;
    themeToggleButton: HTMLButtonElement;
    themeToggleIcon: HTMLElement;
    editorTitle: HTMLDivElement;
    recordingInterface: HTMLDivElement;
    liveRecordingTitle: HTMLDivElement;
    liveWaveformCanvas: HTMLCanvasElement | null;
    liveRecordingTimerDisplay: HTMLDivElement;
    statusIndicatorDiv: HTMLDivElement | null;
    downloadNoteButton: HTMLButtonElement;
    languageSelect: HTMLSelectElement;
}

export interface AudioVisualizerData {
    audioContext: AudioContext | null;
    analyserNode: AnalyserNode | null;
    dataArray: Uint8Array | null;
    animationId: number | null;
}
