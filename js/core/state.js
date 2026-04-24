// Data Default yang Bikin Melongo
export const State = {
    data: {
        name: "Ikram Cyber",
        role: "Tenaga Teknis Kefarmasian & Tech Developer",
        email: "ikram.cyber@matrix.com",
        phone: "+62 812-3456-7890",
        summary: "Profesional hybrid dengan latar belakang D3 Farmasi dan keahlian mendalam di bidang Software Development. Berpengalaman di ritel farmasi sekaligus mampu membangun ekosistem otomasi (AirdropHunter Bot) dan sistem ERP (Financial Manager). Menguasai operasional kesehatan dan efisiensi teknologi.",
        jobTitle: "Asisten Apoteker (Intern) & Freelance Developer",
        jobCompany: "Kimia Farma & ZYNC Tech",
        jobDate: "Mei 2023 - Sekarang"
    },
    listeners: [],
    
    update(key, value) {
        this.data[key] = value;
        this.notify();
    },
    
    subscribe(callback) {
        this.listeners.push(callback);
    },
    
    notify() {
        this.listeners.forEach(callback => callback(this.data));
    }
};
