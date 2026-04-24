export const Magic = {
    dict: {
        id: { cv: "CURRICULUM VITAE", name: "Nama", dob: "Tempat, Tgl Lahir", phone: "No. HP", address: "Alamat", profile: "PROFIL", exp: "PENGALAMAN KERJA", skills: "KEAHLIAN UTAMA", edu: "PENDIDIKAN" },
        en: { cv: "CURRICULUM VITAE", name: "Name", dob: "Date of Birth", phone: "Phone", address: "Address", profile: "PROFESSIONAL PROFILE", exp: "WORK EXPERIENCE", skills: "CORE COMPETENCIES", edu: "EDUCATION" }
    },
    generateSummary(role, lang) {
        const r = (role || '').toLowerCase();
        if(lang === 'id') {
            if(r.includes('security')) return "Petugas Keamanan (Security) profesional dengan rekam jejak yang terbukti. Disiplin, sigap, dan menguasai prosedur patroli.";
            if(r.includes('developer')) return "Software Developer berdedikasi dengan keahlian merancang sistem efisien. Terbiasa memecahkan masalah kompleks dan menulis kode bersih.";
            if(r.includes('farmasi')) return "Tenaga Teknis Kefarmasian bersertifikat dengan ketelitian tinggi dalam peracikan dan pelayanan pasien.";
            return "Profesional bermotivasi tinggi dengan rekam jejak solid. Mudah beradaptasi, komunikatif, dan berorientasi pada efisiensi.";
        } else {
            return "Highly motivated professional with a solid track record. Adaptable, communicative, and driven by operational efficiency.";
        }
    },
    generateCoverLetter(data) {
        const dateStr = new Date().toLocaleDateString(data.lang === 'id' ? 'id-ID' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const city = (data.address || 'Kota').split(',')[0];
        const ttdHTML = data.signature ? `<img src="${data.signature}" class="h-20 mt-4 mb-2 object-contain mix-blend-multiply">` : `<br><br><br><br>`;
        const mainColor = data.color || '#0ea5e9';
        
        // Logika Kondisional: Role hanya muncul jika diisi
        const roleHTML = data.role ? `<h2 class="text-sm font-bold text-slate-500 uppercase tracking-widest mb-5">${data.role}</h2>` : '<div class="mb-5"></div>';
        
        return `
            <div class="bg-white min-h-[297mm] text-slate-900 relative flex flex-col">
                <div class="p-10 pb-8 border-b-[6px]" style="border-color: ${mainColor}; background-color: #f8fafc;">
                    <h1 class="text-4xl font-black uppercase tracking-widest mb-2" style="color: ${mainColor}">${data.name || 'NAMA LENGKAP'}</h1>
                    ${roleHTML}
                    <div class="flex gap-5 text-xs font-semibold text-slate-600">
                        ${data.phone ? `<span class="flex items-center"><i class="fas fa-phone mr-2" style="color: ${mainColor}"></i>${data.phone}</span>` : ''}
                        ${data.email ? `<span class="flex items-center"><i class="fas fa-envelope mr-2" style="color: ${mainColor}"></i>${data.email}</span>` : ''}
                        ${data.link ? `<span class="flex items-center"><i class="fas fa-link mr-2" style="color: ${mainColor}"></i>Portofolio</span>` : ''}
                    </div>
                </div>

                <div class="p-12 flex-1">
                    <p class="text-right text-sm mb-12 font-semibold text-slate-500">${city}, ${dateStr}</p>
                    <p class="text-sm mb-8 font-bold leading-relaxed">${data.lang === 'id' ? 'Yth. HRD Manager<br>Di Tempat' : 'To: HR Manager<br>Company'}</p>
                    
                    <p class="text-sm mb-5">${data.lang === 'id' ? 'Dengan hormat,' : 'Dear Hiring Manager,'}</p>
                    <p class="text-sm mb-5 text-justify leading-relaxed">${data.lang === 'id' ? `Melalui surat ini, saya bermaksud menyampaikan ketertarikan saya untuk mengisi posisi <strong>${data.role || 'yang relevan'}</strong> di perusahaan yang Bapak/Ibu pimpin.` : `I am writing to express my strong interest in the <strong>${data.role || 'open position'}</strong> at your esteemed company.`}</p>
                    
                    <div class="pl-4 border-l-4 py-1 mb-5" style="border-color: ${mainColor}; background: #f8fafc;">
                        <p class="text-sm text-justify leading-relaxed italic text-slate-700">${data.summary || 'Saya memiliki kompetensi yang sesuai dan siap memberikan kontribusi terbaik.'}</p>
                    </div>

                    <p class="text-sm mb-5 text-justify leading-relaxed">${data.lang === 'id' ? 'Sebagai referensi lebih lanjut mengenai kualifikasi, rekam jejak, serta portofolio saya, bersama surat ini telah saya lampirkan Curriculum Vitae (CV) secara terpisah.' : 'For further reference regarding my qualifications, track record, and portfolio, I have attached my Curriculum Vitae alongside this letter.'}</p>
                    
                    <p class="text-sm mb-12 text-justify leading-relaxed">${data.lang === 'id' ? 'Besar harapan saya untuk dapat mendiskusikan peluang ini lebih lanjut dalam sesi wawancara. Atas perhatian dan waktu yang diberikan, saya ucapkan terima kasih.' : 'I sincerely hope to discuss this opportunity further in an interview. Thank you for your time and consideration.'}</p>
                    
                    <p class="text-sm font-semibold">${data.lang === 'id' ? 'Hormat saya,' : 'Sincerely,'}</p>
                    ${ttdHTML}
                    <p class="text-sm font-black uppercase tracking-wider" style="color: ${mainColor}">${data.name || 'Nama Lengkap'}</p>
                </div>
            </div>`;
    }
};
