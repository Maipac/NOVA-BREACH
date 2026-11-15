// All sound effects and the music loop are synthesised at startup (port of Audio.swift), played with XAudio2.
#pragma once
#include "math.h"
#include <string>
#include <functional>

struct AudioImpl;
struct Audio {
    explicit Audio(bool enabled);
    ~Audio();
    void play(const std::string& name, float vol = 1, float pan = 0);
    /// positional playback relative to the listener (simple distance + pan model)
    void play(const std::string& name, V3 pos, V3 listener, float yaw, float vol = 1);
    void setMaster(float v);
    float musicVolume() const { return musicVol; }
    void setMusicVolume(float v);
    bool musicOn() const { return musicEnabled; }
    void setMusicOn(bool on);
    bool enabled = false;
private:
    AudioImpl* impl = nullptr;
    float musicVol = 0.42f;
    bool musicEnabled = true;
    void applyMusic();
};
