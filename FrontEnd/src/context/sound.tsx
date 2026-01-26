import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type SoundName = "eat" | "boost" | "death" | "click" | "lobby";

interface SoundContextType {
    playSound: (name: SoundName) => void;
    stopSound: (name: SoundName) => void;
    mute: boolean;
    toggleMute: () => void;
    setVolume: (v: number) => void;
    volume: number;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

interface SoundProviderProps {
    children: ReactNode;
}

export const SoundProvider: React.FC<SoundProviderProps> = ({ children }) => {
    
    const [mute, setMute] = useState(localStorage.getItem("mute") ? localStorage.getItem("mute") === "true" : false);
    const [volume, setVolumeState] = useState(1);

    const sounds: Record<SoundName, HTMLAudioElement> = {
        eat: new Audio("/Sounds/Eat.wav"),
        boost: new Audio("/Sounds/Boost.wav"),
        death: new Audio("/Sounds/dead.wav"),
        click: new Audio("/Sounds/Click.wav"),
        lobby: new Audio("/Sounds/lobby.mp3"),
    };

    // Set volume & loop for lobby
    Object.entries(sounds).forEach(([name, s]) => {
        s.preload = "auto";
        s.volume = volume;
        if (name === "lobby") s.loop = true; // loop lobby
    });

    const playSound = (name: SoundName) => {
        if (mute) return;
        const sound = sounds[name];
        if (!sound) return;

        if (name === "lobby" && !sound.paused) return; // prevent restarting lobby

        sound.currentTime = 0;
        sound.play().catch(() => { });
    };

    const stopSound = (name: SoundName) => {
        const sound = sounds[name];
        if (!sound) return;
        sound.pause();
        sound.currentTime = 0;
    };

    const toggleMute = () => {
        setMute((prev) => !prev);
        Object.values(sounds).forEach((s) => (s.muted = !mute));
    };

    const setVolume = (v: number) => {
        setVolumeState(v);
        Object.values(sounds).forEach((s) => (s.volume = v));
    };

    return (
        <SoundContext.Provider
            value={{ playSound, stopSound, mute, toggleMute, setVolume, volume }}
        >
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error("useSound must be used within a SoundProvider");
    }
    return context;
};
