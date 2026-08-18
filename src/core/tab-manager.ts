export type TabType = 'note' | 'raw';

export class TabManager {
    private tabButtons: NodeListOf<HTMLButtonElement>;
    private activeTabIndicator: HTMLElement | null;
    private noteContents: NodeListOf<HTMLElement>;
    private currentTab: TabType = 'note';
    private onTabChangeCallback?: (tab: TabType) => void;

    constructor(onTabChange?: (tab: TabType) => void) {
        this.tabButtons = document.querySelectorAll('.tab-button');
        this.activeTabIndicator = document.querySelector('.active-tab-indicator');
        this.noteContents = document.querySelectorAll('.note-content');
        this.onTabChangeCallback = onTabChange;

        this.init();
    }

    private init(): void {
        this.tabButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLButtonElement;
                const tabName = (target.getAttribute('data-tab') as TabType) || 'note';
                this.setActiveTab(tabName);
            });
        });

        window.addEventListener('resize', () => {
            this.updateIndicatorPosition(true);
        });

        // Initialize with default or currently active tab
        const activeBtn = document.querySelector('.tab-button.active') as HTMLButtonElement | null;
        const initialTab = (activeBtn?.getAttribute('data-tab') as TabType) || 'note';
        requestAnimationFrame(() => {
            this.setActiveTab(initialTab, true);
        });
    }

    setActiveTab(tabName: TabType, skipAnimation = false): void {
        this.currentTab = tabName;

        let targetButton: HTMLButtonElement | null = null;
        this.tabButtons.forEach((btn) => {
            const btnTab = btn.getAttribute('data-tab');
            if (btnTab === tabName) {
                btn.classList.add('active');
                targetButton = btn;
            } else {
                btn.classList.remove('active');
            }
        });

        this.noteContents.forEach((content) => {
            if (
                (tabName === 'raw' && content.id === 'rawTranscription') ||
                (tabName === 'note' && content.id === 'polishedNote')
            ) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        if (targetButton) {
            this.animateIndicator(targetButton, skipAnimation);
        }

        if (this.onTabChangeCallback) {
            this.onTabChangeCallback(tabName);
        }
    }

    getActiveTab(): TabType {
        return this.currentTab;
    }

    private updateIndicatorPosition(skipAnimation = false): void {
        const activeButton = document.querySelector('.tab-button.active') as HTMLButtonElement | null;
        if (activeButton) {
            this.animateIndicator(activeButton, skipAnimation);
        }
    }

    private animateIndicator(activeButton: HTMLButtonElement, skipAnimation: boolean): void {
        if (!this.activeTabIndicator) return;

        const originalTransition = this.activeTabIndicator.style.transition;
        if (skipAnimation) {
            this.activeTabIndicator.style.transition = 'none';
        } else {
            this.activeTabIndicator.style.transition = '';
        }

        this.activeTabIndicator.style.left = `${activeButton.offsetLeft}px`;
        this.activeTabIndicator.style.width = `${activeButton.offsetWidth}px`;

        if (skipAnimation) {
            // Force reflow
            void this.activeTabIndicator.offsetHeight;
            this.activeTabIndicator.style.transition = originalTransition;
        }
    }
}
