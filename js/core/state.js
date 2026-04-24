export const State = {
    data: {
        photo: "", signature: "", link: "",
        name: "Nana Suryana", dob: "Sumedang, 17 Agustus 1985", role: "Petugas Keamanan (Security)",
        email: "nana.suryana@matrix.com", phone: "0838-2356-5202", address: "Dusun Cihanyir Landeuh, Sumedang",
        summary: "Petugas Satuan Pengamanan (Security) berpengalaman 16 tahun...",
        experiences: [{ title: "Melakukan penjagaan dan patroli", company: "J.O SINOHYDRO-PP", date: "2015 - 2025" }],
        skills: "Patroli & pengamanan\nKontrol akses", education: "SMK PASUNDAN 2 BANDUNG",
        template: "classic", color: "#0ea5e9", lang: "id", mode: "cv", font: "font-sans"
    },
    listeners: [],
    update(key, value) { this.data[key] = value; this.notify(); },
    subscribe(callback) { this.listeners.push(callback); },
    notify() { this.listeners.forEach(cb => cb(this.data)); },
    getScore() {
        let s = 0; const d = this.data;
        if(d.name) s+=10; if(d.role) s+=10; if(d.dob) s+=5; if(d.link) s+=5;
        if(d.email && d.phone) s+=10; if(d.address) s+=10; if(d.photo) s+=10; if(d.signature) s+=5;
        if(d.summary) s+=10; if(d.experiences && d.experiences.length>0) s+=15;
        if(d.skills) s+=5; if(d.education) s+=5;
        return s > 100 ? 100 : s;
    }
};
