export const State = {
    data: {
        photo: "", signature: "", link: "",
        name: "Ikram", dob: "Jakarta, 12 Desember 2000", role: "Tenaga Teknis Kefarmasian & Developer",
        email: "ikram.cyber@matrix.com", phone: "0812-xxxx-xxxx", 
        address: "Jl. Raya Farmasi No. 1, Jakarta",
        summary: "Pharmacy graduate (D3) dari IKIFA dengan STRTTK aktif. Memiliki keahlian unik dalam pengembangan software menggunakan Python dan Pine Script.",
        experiences: [{ title: "Asisten Apoteker (Intern)", company: "Kimia Farma", date: "Mei 2023 - Jun 2023" }],
        skills: "Pelayanan Kefarmasian (STRTTK)\nPython & Pine Script v6\nFinancial modeling (Brevet A & B)",
        education: "D3 Farmasi - IKIFA (Lulus 2023)",
        // FITUR BARU
        certifications: "STRTTK (Tenaga Teknis Kefarmasian)\nSertifikat Brevet Pajak A & B\nFood Safety Training Certification",
        projects: "AirdropHunter: Telegram Bot Automation (Node.js)\nApex Institutional Flow v6: TradingView Indicator\nCLI Financial Manager (Python & Firebase)",
        languages: "Bahasa Indonesia (Native)\nEnglish (Professional Working Proficiency)",
        organizations: "Anggota Persatuan Ahli Farmasi Indonesia (PAFI)\nKontributor Open Source di GitHub (ikram-cyber)",
        readiness: "Tersedia untuk kerja shift / Full-time / Segera",
        template: "classic", color: "#0ea5e9", lang: "id", mode: "cv", font: "font-sans"
    },
    listeners: [],
    update(key, value) { this.data[key] = value; this.notify(); },
    subscribe(callback) { this.listeners.push(callback); },
    notify() { this.listeners.forEach(cb => cb(this.data)); },
    getScore() {
        let s = 0; const d = this.data;
        if(d.name) s+=5; if(d.role) s+=5; if(d.photo) s+=10; if(d.summary) s+=10;
        if(d.experiences && d.experiences.length>0) s+=15;
        if(d.certifications) s+=10; if(d.projects) s+=15; if(d.skills) s+=10;
        if(d.languages) s+=10; if(d.readiness) s+=10;
        return s > 100 ? 100 : s;
    }
};
