import AVFoundation
import simd

/// All sound effects and the music loop are synthesised at startup.
final class Audio {
    private let engine = AVAudioEngine()
    private var players: [AVAudioPlayerNode] = []
    private var next = 0
    private let mono = AVAudioFormat(standardFormatWithSampleRate: 44100, channels: 1)!
    private let stereo = AVAudioFormat(standardFormatWithSampleRate: 44100, channels: 2)!
    private var sounds: [String: AVAudioPCMBuffer] = [:]
    private let music = AVAudioPlayerNode()
    private(set) var enabled: Bool
    private var musicBuffer: AVAudioPCMBuffer?
    private var musicStarted = false
    var musicVolume: Float = 0.42 { didSet { music.volume = musicOn ? musicVolume : 0 } }
    var musicOn = true { didSet { music.volume = musicOn ? musicVolume : 0 } }
    static let sr: Float = 44100

    func setMaster(_ v: Float) { if enabled { engine.mainMixerNode.outputVolume = v } }

    private struct LCG {
        var s: UInt32
        mutating func next() -> Float { s = s &* 1664525 &+ 1013904223; return Float(Int32(bitPattern: s)) / 2147483648 }
    }

    init(enabled: Bool) {
        self.enabled = enabled
        guard enabled else { return }
        buildSounds()
        for _ in 0..<22 {
            let p = AVAudioPlayerNode()
            engine.attach(p)
            engine.connect(p, to: engine.mainMixerNode, format: mono)
            players.append(p)
        }
        engine.attach(music)
        engine.connect(music, to: engine.mainMixerNode, format: stereo)
        engine.mainMixerNode.outputVolume = 0.9
        do {
            try engine.start()
            for p in players { p.play() }
        } catch {
            self.enabled = false
            return
        }
        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self = self else { return }
            let buf = self.makeMusic()
            DispatchQueue.main.async {
                self.musicBuffer = buf
                self.music.volume = self.musicOn ? self.musicVolume : 0
                self.music.scheduleBuffer(buf, at: nil, options: .loops, completionHandler: nil)
                self.music.play()
                self.musicStarted = true
            }
        }
    }

    func play(_ name: String, vol: Float = 1, pan: Float = 0) {
        guard enabled, let buf = sounds[name] else { return }
        let p = players[next]
        next = (next + 1) % players.count
        p.volume = vol
        p.pan = max(-1, min(1, pan))
        p.scheduleBuffer(buf, at: nil, options: .interrupts, completionHandler: nil)
    }

    /// Positional playback relative to the listener (simple distance + pan model).
    func play(_ name: String, at pos: V3, listener: V3, yaw: Float, vol: Float = 1) {
        guard enabled else { return }
        let v = pos - listener
        let d = simd_length(v)
        let att = 1 / (1 + d * d / 180)
        if att < 0.03 { return }
        let right = V3(cos(yaw), 0, -sin(yaw))
        let pan = d > 0.5 ? simd_dot(v / d, right) * 0.8 : 0
        play(name, vol: vol * att, pan: pan)
    }

    // MARK: synthesis

    private func buffer(_ samples: [Float]) -> AVAudioPCMBuffer {
        let b = AVAudioPCMBuffer(pcmFormat: mono, frameCapacity: AVAudioFrameCount(samples.count))!
        b.frameLength = AVAudioFrameCount(samples.count)
        let ch = b.floatChannelData![0]
        for i in 0..<samples.count { ch[i] = samples[i] }
        return b
    }

    private func render(_ dur: Float, gain: Float = 1, seed: UInt32 = 1, _ f: (Float, inout LCG) -> Float) -> AVAudioPCMBuffer {
        let n = Int(dur * Audio.sr)
        var out = [Float](repeating: 0, count: n)
        var rng = LCG(s: seed &* 7919 &+ 13)
        for i in 0..<n {
            let t = Float(i) / Audio.sr
            let fadeOut = min(1, Float(n - i) / 300)
            out[i] = tanh(f(t, &rng) * gain) * fadeOut
        }
        return buffer(out)
    }

    private func buildSounds() {
        let tau = 2 * Float.pi
        let dt = 1 / Audio.sr

        do { // pulse rifle
            var ph: Float = 0, lp: Float = 0
            sounds["rifle"] = render(0.2, gain: 1.3) { t, n in
                ph += tau * (150 + 1000 * exp(-t * 42)) * dt
                lp += (n.next() - lp) * 0.5
                return (sin(ph) + 0.4 * sin(ph * 2.01)) * exp(-t * 24) * 0.55 + lp * exp(-t * 50) * 0.8
            }
        }
        do { // shotgun
            var lp: Float = 0, lp2: Float = 0, ph: Float = 0
            sounds["shotgun"] = render(0.55, gain: 2.0) { t, n in
                let cut = 0.06 + 0.6 * exp(-t * 14)
                lp += (n.next() - lp) * cut
                lp2 += (lp - lp2) * cut
                ph += tau * (48 + 90 * exp(-t * 18)) * dt
                return lp2 * exp(-t * 8) * 1.4 + sin(ph) * exp(-t * 11) * 0.9
            }
        }
        do { // railgun
            var ph: Float = 0, ph2: Float = 0, lp: Float = 0
            sounds["rail"] = render(0.9, gain: 1.6) { t, n in
                ph += tau * (110 + 2400 * exp(-t * 7)) * dt
                ph2 += tau * 53 * dt
                lp += (n.next() - lp) * 0.7
                let saw = 2 * (ph / tau - floor(ph / tau + 0.5))
                return saw * exp(-t * 5) * 0.45 * (0.7 + 0.3 * sin(ph2 * 6)) + lp * exp(-t * 30) * 0.9 + sin(ph2) * exp(-t * 6) * 0.7
            }
        }
        do { // plasma launcher
            var ph: Float = 0, lp: Float = 0
            sounds["launcher"] = render(0.5, gain: 1.7) { t, n in
                ph += tau * (50 + 170 * exp(-t * 16)) * dt
                lp += (n.next() - lp) * 0.12
                return sin(ph) * exp(-t * 8) + lp * exp(-t * 12) * 1.3
            }
        }
        do { // explosion
            var lp: Float = 0, lp2: Float = 0, ph: Float = 0
            sounds["explosion"] = render(1.5, gain: 2.4) { t, n in
                let cut = 0.012 + 0.35 * exp(-t * 6)
                lp += (n.next() - lp) * cut
                lp2 += (lp - lp2) * cut
                ph += tau * (28 + 60 * exp(-t * 7)) * dt
                return lp2 * exp(-t * 3.2) * 2.2 + sin(ph) * exp(-t * 4.5) * 0.9
            }
        }
        do { // enemy blaster
            var ph: Float = 0
            sounds["enemyShot"] = render(0.22, gain: 0.9) { t, _ in
                ph += tau * (380 + 1300 * exp(-t * 16)) * dt
                let sq: Float = sin(ph) > 0 ? 1 : -1
                return (sin(ph) * 0.7 + sq * 0.18) * exp(-t * 17)
            }
        }
        do { // hit marker tick
            var ph: Float = 0
            sounds["hit"] = render(0.06, gain: 0.8) { t, _ in
                ph += tau * 2300 * dt
                return sin(ph) * exp(-t * 90)
            }
            var ph2: Float = 0
            sounds["crit"] = render(0.1, gain: 0.9) { t, _ in
                ph2 += tau * (t < 0.03 ? 2600 : 3500) * dt
                return sin(ph2) * exp(-t * 45)
            }
        }
        do { // kill confirm
            var ph: Float = 0
            sounds["kill"] = render(0.22, gain: 0.8) { t, _ in
                ph += tau * (t < 0.07 ? 880 : 1320) * dt
                return (sin(ph) + 0.3 * sin(ph * 2)) * exp(-t * 16) * 0.8
            }
        }
        do { // enemy destroyed
            var ph: Float = 0, lp: Float = 0
            sounds["enemyDie"] = render(0.4, gain: 1.5) { t, n in
                ph += tau * (70 + 600 * exp(-t * 12)) * dt
                lp += (n.next() - lp) * 0.3
                let sq: Float = sin(ph) > 0 ? 1 : -1
                return sq * exp(-t * 11) * 0.35 + lp * exp(-t * 9) * 0.9
            }
        }
        do { // player hurt
            var ph: Float = 0, lp: Float = 0
            sounds["hurt"] = render(0.3, gain: 1.6) { t, n in
                ph += tau * (70 + 90 * exp(-t * 20)) * dt
                lp += (n.next() - lp) * 0.2
                return sin(ph) * exp(-t * 12) + lp * exp(-t * 20) * 0.8
            }
            var ph2: Float = 0
            sounds["shieldHit"] = render(0.25, gain: 1.0) { t, n in
                ph2 += tau * (900 + 500 * sin(t * 90)) * dt
                return sin(ph2) * exp(-t * 16) * 0.6 + n.next() * exp(-t * 40) * 0.3
            }
        }
        do { // pickup
            var ph: Float = 0
            sounds["pickup"] = render(0.42, gain: 0.8) { t, _ in
                let f: Float = t < 0.09 ? 660 : (t < 0.18 ? 880 : 1320)
                ph += tau * f * dt
                let lt = t < 0.09 ? t : (t < 0.18 ? t - 0.09 : t - 0.18)
                return (sin(ph) + 0.25 * sin(ph * 3)) * exp(-lt * 9) * 0.7
            }
            var ph2: Float = 0
            sounds["power"] = render(0.8, gain: 0.9) { t, _ in
                ph2 += tau * (220 + 900 * t * t + 30 * sin(t * 70)) * dt
                let saw = 2 * (ph2 / tau - floor(ph2 / tau + 0.5))
                return (sin(ph2) * 0.7 + saw * 0.2) * min(1, t * 20) * exp(-max(0, t - 0.5) * 9)
            }
        }
        do { // reload clicks
            var bp: Float = 0, lp: Float = 0
            sounds["reload"] = render(0.5, gain: 1.4) { t, n in
                let a = exp(-max(0, t - 0.02) * 90) * (t > 0.02 ? 1 : 0)
                let b = exp(-max(0, t - 0.3) * 70) * (t > 0.3 ? 1 : 0)
                let c = exp(-max(0, t - 0.38) * 110) * (t > 0.38 ? 1 : 0)
                let x = n.next()
                lp += (x - lp) * 0.35
                bp = x - lp
                return bp * (a * 0.8 + b + c * 0.7) + sin(t * tau * 420) * c * 0.25
            }
            sounds["empty"] = render(0.07, gain: 1.0) { t, n in n.next() * exp(-t * 130) * 0.6 + sin(t * tau * 1500) * exp(-t * 100) * 0.3 }
            var lp2: Float = 0
            sounds["swap"] = render(0.18, gain: 1.2) { t, n in
                lp2 += (n.next() - lp2) * 0.25
                return lp2 * sin(min(t / 0.18, 1) * .pi) * 0.9 + sin(t * tau * 300) * exp(-max(0, t - 0.12) * 80) * (t > 0.12 ? 0.3 : 0)
            }
        }
        do { // dash whoosh
            var lp: Float = 0, lp2: Float = 0
            sounds["dash"] = render(0.35, gain: 1.6) { t, n in
                let k = sin(min(t / 0.35, 1) * .pi)
                let cut = 0.05 + 0.4 * k
                lp += (n.next() - lp) * cut
                lp2 += (lp - lp2) * cut
                return lp2 * k * 1.5
            }
            var ph: Float = 0
            sounds["jump"] = render(0.14, gain: 0.9) { t, n in
                ph += tau * (130 + 120 * t * 7) * dt
                return sin(ph) * exp(-t * 26) * 0.5 + n.next() * exp(-t * 60) * 0.12
            }
            var ph3: Float = 0, lp3: Float = 0
            sounds["land"] = render(0.16, gain: 1.2) { t, n in
                ph3 += tau * (60 + 70 * exp(-t * 30)) * dt
                lp3 += (n.next() - lp3) * 0.15
                return sin(ph3) * exp(-t * 26) * 0.7 + lp3 * exp(-t * 30)
            }
        }
        do { // wave alarm
            var ph: Float = 0, lp: Float = 0
            sounds["wave"] = render(1.1, gain: 0.9) { t, _ in
                let seg = Int(t / 0.26)
                let lt = t - Float(seg) * 0.26
                let f: Float = seg % 2 == 0 ? 440 : 587.3
                ph += tau * f * dt
                let sq: Float = sin(ph) > 0 ? 1 : -1
                lp += (sq - lp) * 0.18
                return (lp * 0.5 + sin(ph) * 0.4) * min(1, lt * 80) * exp(-lt * 5) * (seg < 4 ? 1 : 0)
            }
            var ph2: Float = 0, lp2: Float = 0
            sounds["boss"] = render(2.0, gain: 1.6) { t, n in
                ph2 += tau * (44 + 12 * sin(t * 3)) * dt
                let saw = 2 * (ph2 / tau - floor(ph2 / tau + 0.5))
                lp2 += (saw + 0.3 * n.next() - lp2) * (0.04 + 0.1 * min(t, 1))
                return lp2 * min(1, t * 4) * exp(-max(0, t - 1.2) * 4) * (0.7 + 0.3 * sin(t * 37)) * 2
            }
            var ph3: Float = 0
            sounds["spawn"] = render(0.4, gain: 0.8) { t, _ in
                ph3 += tau * (180 + 1500 * t) * dt
                return sin(ph3) * (0.6 + 0.4 * sin(t * 160)) * sin(min(t / 0.4, 1) * .pi) * 0.6
            }
            var ph4: Float = 0
            sounds["waveClear"] = render(0.7, gain: 0.8) { t, _ in
                let f: Float = t < 0.12 ? 523.25 : (t < 0.24 ? 659.25 : (t < 0.36 ? 783.99 : 1046.5))
                ph4 += tau * f * dt
                let lt = t < 0.36 ? t.truncatingRemainder(dividingBy: 0.12) : t - 0.36
                return (sin(ph4) + 0.3 * sin(ph4 * 2)) * exp(-lt * 6) * 0.6
            }
            var ph5: Float = 0
            sounds["death"] = render(1.6, gain: 1.3) { t, n in
                ph5 += tau * (220 * exp(-t * 1.6) + 30) * dt
                let saw = 2 * (ph5 / tau - floor(ph5 / tau + 0.5))
                return (saw * 0.4 + sin(ph5 * 0.5) * 0.6) * exp(-t * 1.6) + n.next() * exp(-t * 14) * 0.5
            }
            var ph6: Float = 0
            sounds["ui"] = render(0.12, gain: 0.7) { t, _ in
                ph6 += tau * 990 * dt
                return sin(ph6) * exp(-t * 30)
            }
            var ph7: Float = 0
            sounds["melee"] = render(0.2, gain: 1.4) { t, n in
                ph7 += tau * (90 + 200 * exp(-t * 30)) * dt
                return sin(ph7) * exp(-t * 20) + n.next() * exp(-t * 50) * 0.5
            }
            var ph8: Float = 0
            sounds["beep"] = render(0.09, gain: 0.7) { t, _ in
                ph8 += tau * 1760 * dt
                return (sin(ph8) > 0 ? 0.5 : -0.5) * exp(-t * 25)
            }
        }
    }

    // MARK: music

    private func makeMusic() -> AVAudioPCMBuffer {
        let sr = Audio.sr
        let bpm: Float = 104
        let beat = 60 / bpm
        let step = beat / 4
        let bars = 8
        let n = Int(Float(bars * 4) * beat * sr)
        var L = [Float](repeating: 0, count: n), R = [Float](repeating: 0, count: n)
        let tau = 2 * Float.pi
        var rng = LCG(s: 4242)

        func add(_ start: Float, _ dur: Float, _ gl: Float, _ gr: Float, _ f: (Float) -> Float) {
            let s0 = Int(start * sr), cnt = Int(dur * sr)
            for i in 0..<cnt {
                let v = f(Float(i) / sr)
                let j = (s0 + i) % n
                L[j] += v * gl; R[j] += v * gr
            }
        }

        let roots: [Float] = [73.42, 73.42, 87.31, 65.41, 73.42, 73.42, 58.27, 65.41]
        let chords: [[Float]] = [
            [146.83, 174.61, 220.0], [146.83, 174.61, 220.0], [174.61, 220.0, 261.63], [130.81, 164.81, 196.0],
            [146.83, 174.61, 220.0], [146.83, 174.61, 220.0], [116.54, 146.83, 174.61], [130.81, 164.81, 196.0],
        ]
        let bassPat: [Int] = [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1]
        let bassOct: [Float] = [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2]
        let arpPat: [Int] = [0, 1, 2, 1, 0, 2, 1, 2, 0, 1, 2, 0, 2, 1, 0, 2]

        for bar in 0..<bars {
            let barT = Float(bar * 4) * beat
            // kick + snare
            for b in 0..<4 {
                let t0 = barT + Float(b) * beat
                var ph: Float = 0
                add(t0, 0.3, 0.75, 0.75) { t in
                    ph += tau * (42 + 95 * exp(-t * 28)) / sr
                    return sin(ph) * exp(-t * 10)
                }
                if b % 2 == 1 {
                    var lp: Float = 0, ph2: Float = 0
                    add(t0, 0.22, 0.26, 0.26) { t in
                        let x = rng.next()
                        lp += (x - lp) * 0.3
                        ph2 += tau * 185 / sr
                        return (x - lp) * exp(-t * 20) + sin(ph2) * exp(-t * 30) * 0.5
                    }
                }
            }
            for s in 0..<16 {
                let t0 = barT + Float(s) * step
                // hats
                var lp: Float = 0
                let acc: Float = s % 4 == 2 ? 0.16 : (s % 2 == 1 ? 0.05 : 0.09)
                add(t0, 0.07, acc * 0.8, acc) { t in
                    let x = rng.next()
                    lp += (x - lp) * 0.6
                    return (x - lp) * exp(-t * (s % 4 == 2 ? 45 : 90))
                }
                // bass
                if bassPat[s] == 1 {
                    let f = roots[bar] * bassOct[s]
                    var ph: Float = 0, flt: Float = 0
                    add(t0, step * 1.1, 0.34, 0.34) { t in
                        ph += f / sr
                        ph -= floor(ph)
                        let saw = 2 * ph - 1
                        let cut = 0.03 + 0.22 * exp(-t * 18)
                        flt += (saw - flt) * cut
                        return flt * min(1, t * 300) * exp(-t * 7)
                    }
                }
                // arpeggio with ping-pong echoes (only in the second half of each 2-bar phrase start)
                if bar >= 2 {
                    let f = chords[bar][arpPat[s]] * (s % 8 == 7 ? 4 : 2)
                    for (k, g) in [(0, Float(0.085)), (3, 0.05), (6, 0.028)] {
                        var ph: Float = 0
                        let gl = k == 3 ? g * 0.3 : g, gr = k == 6 ? g * 0.3 : (k == 3 ? g : g * 0.8)
                        add(t0 + Float(k) * step, 0.32, gl, gr) { t in
                            ph += tau * f / sr
                            return (sin(ph) + 0.35 * sin(ph * 2) + 0.15 * sin(ph * 3)) * exp(-t * 13) * min(1, t * 400)
                        }
                    }
                }
            }
            // pad
            let barDur = 4 * beat
            for (ci, f) in chords[bar].enumerated() {
                for (det, gl, gr) in [(Float(0.996), Float(0.05), Float(0.02)), (1.004, 0.02, 0.05), (0.5, 0.03, 0.03)] {
                    var ph: Float = Float(ci) * 0.31, flt: Float = 0
                    add(barT, barDur + 0.25, gl, gr) { t in
                        ph += f * det / sr
                        ph -= floor(ph)
                        flt += ((2 * ph - 1) - flt) * 0.045
                        let env = min(1, t / 0.25) * min(1, max(0, (barDur + 0.25 - t) / 0.25))
                        return flt * env
                    }
                }
            }
        }
        let buf = AVAudioPCMBuffer(pcmFormat: stereo, frameCapacity: AVAudioFrameCount(n))!
        buf.frameLength = AVAudioFrameCount(n)
        let l = buf.floatChannelData![0], r = buf.floatChannelData![1]
        for i in 0..<n { l[i] = tanh(L[i] * 1.15); r[i] = tanh(R[i] * 1.15) }
        return buf
    }
}
