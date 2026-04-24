export const State = {
    data: {
        photo: "",
        name: "Nana Suryana",
        role: "Petugas Keamanan (Security)",
        email: "nana.suryana@matrix.com",
        phone: "0838-2356-5202",
        address: "Dusun Cihanyir Landeuh, RT/RW 04/03 Desa Cipicung, Kec. Jatigede, Kab. Sumedang",
        summary: "Petugas Satuan Pengamanan (Security) berpengalaman 16 tahun dalam pengamanan area kerja. Terbiasa bekerja disiplin, tegas, dan bertanggung jawab. Memahami prosedur keamanan, patroli, pengawasan akses, serta penanganan situasi darurat. Siap bekerja shift & lembur.",
        experiences: [
            { title: "Melakukan penjagaan dan patroli rutin area kerja", company: "J.O SINOHYDRO-PP", date: "01 JUNI 2015 S/D 29 NOVEMBER 2025" }
        ],
        skills: "Patroli & pengamanan area\nKontrol akses & pemeriksaan\nDisiplin, loyal, dan kerja tim",
        education: "Pendidikan terakhir : SMK PASUNDAN 2 BANDUNG (2002)",
        template: "classic"
    },
    listeners: [],
    update(key, value) { this.data[key] = value; this.notify(); },
    subscribe(callback) { this.listeners.push(callback); },
    notify() { this.listeners.forEach(cb => cb(this.data)); }
};
