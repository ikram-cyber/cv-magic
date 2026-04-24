export const State = {
    data: {
        photo: "", // Wadah Pas Foto
        name: "Ikram Cyber",
        role: "Tenaga Teknis Kefarmasian & Developer",
        email: "ikram.cyber@matrix.com",
        phone: "+62 812-3456-7890",
        summary: "Profesional hybrid dengan latar belakang Kefarmasian dan keahlian mendalam di bidang Software Development.",
        experiences: [
            { title: "Freelance Developer", company: "ZYNC Tech", date: "Jan 2025 - Sekarang" },
            { title: "Asisten Apoteker (Intern)", company: "Kimia Farma", date: "Mei 2023 - Jun 2023" }
        ],
        template: "pro"
    },
    listeners: [],
    update(key, value) { this.data[key] = value; this.notify(); },
    subscribe(callback) { this.listeners.push(callback); },
    notify() { this.listeners.forEach(cb => cb(this.data)); }
};
