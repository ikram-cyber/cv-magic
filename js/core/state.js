export const State = {
    data: {
        photo: "",
        name: "Nana Suryana",
        dob: "Sumedang, 17 Agustus 1985",
        role: "Petugas Keamanan (Security)",
        email: "nana.suryana@matrix.com",
        phone: "0838-2356-5202",
        address: "Dusun Cihanyir Landeuh, RT/RW 04/03 Desa Cipicung, Kec. Jatigede",
        summary: "Petugas Satuan Pengamanan (Security) berpengalaman 16 tahun dalam pengamanan area kerja...",
        experiences: [{ title: "Melakukan penjagaan dan patroli rutin area kerja", company: "J.O SINOHYDRO-PP", date: "01 JUNI 2015 S/D 29 NOVEMBER 2025" }],
        skills: "Patroli & pengamanan area\nKontrol akses",
        education: "SMK PASUNDAN 2 BANDUNG (2002)",
        template: "classic",
        color: "#0ea5e9",
        lang: "id",       // Fitur Baru: Bahasa
        mode: "cv"        // Fitur Baru: Mode (CV / Cover Letter)
    },
    listeners: [],
    update(key, value) { this.data[key] = value; this.notify(); },
    subscribe(callback) { this.listeners.push(callback); },
    notify() { this.listeners.forEach(cb => cb(this.data)); },
    getScore() {
        let score = 0; const d = this.data;
        if(d.name) score += 10; if(d.role) score += 10; if(d.dob) score += 10;
        if(d.email && d.phone) score += 10; if(d.address) score += 10;
        if(d.photo) score += 15; if(d.summary) score += 10;
        if(d.experiences && d.experiences.length > 0) score += 15;
        if(d.skills) score += 5; if(d.education) score += 5;
        return score > 100 ? 100 : score;
    }
};
