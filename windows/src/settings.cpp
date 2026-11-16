#include "settings.h"
#include <windows.h>
#include <shlobj.h>
#include <cstdio>

Settings& Settings::shared() { static Settings s; return s; }

Settings::Settings() {
    wchar_t dir[MAX_PATH] = {};
    if (SUCCEEDED(SHGetFolderPathW(nullptr, CSIDL_APPDATA, nullptr, 0, dir))) {
        std::wstring d = std::wstring(dir) + L"\\NOVA BREACH";
        CreateDirectoryW(d.c_str(), nullptr);
        path = d + L"\\settings.txt";
    }
    if (path.empty()) return;
    FILE* f = _wfopen(path.c_str(), L"rb");
    if (!f) return;
    char line[4096];
    while (fgets(line, sizeof line, f)) {
        std::string l(line);
        while (!l.empty() && (l.back() == '\n' || l.back() == '\r')) l.pop_back();
        size_t eq = l.find('=');
        if (eq == std::string::npos) continue;
        values[l.substr(0, eq)] = l.substr(eq + 1);
    }
    fclose(f);
}

void Settings::save() const {
    if (!persist || path.empty()) return;
    std::wstring tmp = path + L".tmp";
    FILE* f = _wfopen(tmp.c_str(), L"wb");
    if (!f) return;
    for (auto& [k, v] : values) fprintf(f, "%s=%s\n", k.c_str(), v.c_str());
    fclose(f);
    MoveFileExW(tmp.c_str(), path.c_str(), MOVEFILE_REPLACE_EXISTING);
}

int Settings::integer(const std::string& key, int def) const {
    auto it = values.find(key);
    return it == values.end() ? def : atoi(it->second.c_str());
}
void Settings::set(const std::string& key, int v) { values[key] = std::to_string(v); save(); }
std::string Settings::string(const std::string& key, const std::string& def) const {
    auto it = values.find(key);
    return it == values.end() ? def : it->second;
}
void Settings::set(const std::string& key, const std::string& v) { values[key] = v; save(); }
std::vector<std::string> Settings::list(const std::string& key) const {
    std::vector<std::string> out;
    std::string s = string(key);
    size_t a = 0;
    while (a < s.size()) {
        size_t b = s.find(',', a);
        if (b == std::string::npos) b = s.size();
        if (b > a) out.push_back(s.substr(a, b - a));
        a = b + 1;
    }
    return out;
}
void Settings::set(const std::string& key, const std::vector<std::string>& v) {
    std::string s;
    for (size_t i = 0; i < v.size(); i++) { if (i) s += ","; s += v[i]; }
    set(key, s);
}
void Settings::remove(const std::string& key) { values.erase(key); save(); }
