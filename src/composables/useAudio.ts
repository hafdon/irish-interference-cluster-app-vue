// src/composables/useAudio.ts
import type { HowlOptions } from 'howler';
import { Howl } from 'howler';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

export function useAudio() {
    const isPlaying = ref(false);
    const currentSound = ref<Howl | null>(null);
    const toast = useToast();

    const getAudioURL = (word: string, region: string): string => {

        console.log(word, typeof word)

        const formattedWord = word.trim().toLowerCase();
        switch (region) {
            case 'Connacht':
                return `https://www.teanglann.ie/CanC/${formattedWord}.mp3`;
            case 'Munster':
                return `https://www.teanglann.ie/CanM/${formattedWord}.mp3`;
            case 'Ulster':
                return `https://www.teanglann.ie/CanU/${formattedWord}.mp3`;
            default:
                return '';
        }
    };

    const playAudio = (word: string, region: string) => {
        const url = getAudioURL(word, region);

        if (currentSound.value) {
            currentSound.value.stop();
        }

        const howlOptions: HowlOptions = {
            src: [url],
            html5: true,
            onplay: () => {
                isPlaying.value = true;
            },
            onend: () => {
                isPlaying.value = false;
            },
            onloaderror: (id: number, error: any) => {
                console.error('Load error:', error);
                isPlaying.value = false;
                toast.error(`Failed to load audio for region "${region}".`);
            },
            onplayerror: (id: number, error: any) => {
                console.error('Play error:', error);
                isPlaying.value = false;
                toast.error(`Failed to play audio for region "${region}".`);
            },
        };

        currentSound.value = new Howl(howlOptions);
        currentSound.value.play();
    };

    return {
        isPlaying,
        playAudio,
    };
}
