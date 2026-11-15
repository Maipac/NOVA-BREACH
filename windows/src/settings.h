// Persistent key/value store (replaces UserDefaults): %APPDATA%\NOVA BREACH\settings.txt
#pragma once
#include <string>
#include <vector>
#include <map>

struct Settings {
    static Settings& shared();
    int integer(const std::string& key, int def = 0) const;
    void set(const std::string& key, int v);
    std::string string(const std::string& key, const std::string& def = "") const;
    void set(const std::string& key, const std::string& v);
    std::vector<std::string> list(const std::string& key) const;
    void set(const std::string& key, const std::vector<std::string>& v);
    bool has(const std::string& key) const { return values.count(key) > 0; }
    void remove(const std::string& key);
    /// test runs keep everything in memory
    bool persist = true;

private:
    Settings();
    void save() const;
    std::map<std::string, std::string> values;
    std::wstring path;
};
