export const Magic = {
    dict: {
        id: { cv: "CURRICULUM VITAE", name: "Nama", dob: "Tempat, Tgl Lahir", phone: "No. HP", address: "Alamat", profile: "PROFIL", exp: "PENGALAMAN KERJA", skills: "KEAHLIAN UTAMA", edu: "PENDIDIKAN & SERTIFIKAT" },
        en: { cv: "CURRICULUM VITAE", name: "Name", dob: "Date of Birth", phone: "Phone", address: "Address", profile: "PROFESSIONAL PROFILE", exp: "WORK EXPERIENCE", skills: "CORE COMPETENCIES", edu: "EDUCATION & CERTIFICATIONS" }
    },
    generateSummary(role, lang) {
        const r = (role || '').toLowerCase();
        if(lang === 'id') {
            if(r.includes('security')) return "Petugas Keamanan (Security) profesional dengan rekam jejak yang terbukti dalam menjaga keamanan aset, personel, dan fasilitas. Disiplin, sigap, dan menguasai prosedur patroli.";
            if(r.includes('developer')) return "Software Developer berdedikasi dengan keahlian dalam merancang sistem yang efisien. Terbiasa memecahkan masalah kompleks dan menulis kode yang bersih.";
            if(r.includes('farmasi')) return "Tenaga Teknis Kefarmasian bersertifikat dengan ketelitian tinggi dalam peracikan, manajemen stok obat, dan pelayanan pasien.";
            return "Profesional bermotivasi tinggi dengan rekam jejak solid. Mudah beradaptasi, komunikatif, dan selalu berorientasi pada efisiensi.";
        } else {
            return "Highly motivated professional with a solid track record. Adaptable, communicative, and constantly driven by operational efficiency.";
        }
    },
    generateCoverLetter(data) {
        const dateStr = new Date().toLocaleDateString(data.lang === 'id' ? 'id-ID' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const city = (data.address || 'Kota').split(',')[0];
        const ttdHTML = data.signature ? `<img src="${data.signature}" class="h-16 mt-4 mb-2 object-contain">` : `<br><br><br>`;
        
        return `
            <div class="p-10 bg-white min-h-[297mm] text-slate-900 relative">
                <p class="text-right text-sm mb-10">${city}, ${dateStr}</p>
                <p class="text-sm mb-6">${data.lang === 'id' ? 'Yth. HRD Manager<br>Di Tempat' : 'To: HR Manager<br>Company'}</p>
                <p class="text-sm mb-4">${data.lang === 'id' ? 'Dengan hormat,' : 'Dear Hiring Manager,'}</p>
                <p class="text-sm mb-4 text-justify leading-relaxed">${data.lang === 'id' ? `Melalui surat ini, saya bermaksud melamar pekerjaan pada posisi <strong>${data.role || 'yang sesuai'}</strong>.` : `I am writing to express my interest in the <strong>${data.role || 'open position'}</strong>.`}</p>
                <p class="text-sm mb-4 text-justify leading-relaxed">${data.summary || 'Saya memiliki motivasi tinggi untuk berkontribusi pada perusahaan Anda.'}</p>
                <p class="text-sm mb-4 text-justify leading-relaxed">${data.lang === 'id' ? 'Sebagai bahan pertimbangan, saya lampirkan CV ini. Saya sangat berharap dapat diberikan kesempatan wawancara.' : 'I have attached my CV for your review. I welcome the opportunity for an interview.'}</p>
                <p class="text-sm mb-8">${data.lang === 'id' ? 'Atas perhatian Bapak/Ibu, saya ucapkan terima kasih.' : 'Thank you for your time and consideration.'}</p>
                <p class="text-sm">${data.lang === 'id' ? 'Hormat saya,' : 'Sincerely,'}</p>
                ${ttdHTML}
                <p class="text-sm font-bold underline">${data.name || 'Nama Lengkap'}</p>
            </div>`;
    }
};
