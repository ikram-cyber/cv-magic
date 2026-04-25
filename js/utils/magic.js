export const Magic = {
    dict: {
        id: { cv: "CURRICULUM VITAE", name: "Nama", dob: "Tempat, Tgl Lahir", phone: "No. HP", address: "Alamat", profile: "PROFIL", exp: "PENGALAMAN KERJA", skills: "KEAHLIAN UTAMA", edu: "PENDIDIKAN" },
        en: { cv: "CURRICULUM VITAE", name: "Name", dob: "Date of Birth", phone: "Phone", address: "Address", profile: "PROFESSIONAL PROFILE", exp: "WORK EXPERIENCE", skills: "CORE COMPETENCIES", edu: "EDUCATION" }
    },
    
    generateSummary(data) {
        const r = (data.role || '').toLowerCase();
        const lang = data.lang || 'id';
        const hasExp = data.experiences && data.experiences.some(e => e.title || e.company);

        if(lang === 'id') {
            if (!hasExp) {
                if(r.includes('security')) return "Individu yang sangat disiplin dan sigap, bermotivasi tinggi untuk memulai karier sebagai Petugas Keamanan. Memiliki fisik prima dan siap dilatih mengikuti prosedur pengamanan ketat.";
                if(r.includes('developer')) return "Lulusan baru yang bersemangat di bidang Software Development. Memiliki fondasi algoritma yang kuat dan antusiasme tinggi untuk berkontribusi dalam tim.";
                if(r.includes('farmasi')) return "Lulusan farmasi yang teliti dan berdedikasi. Memiliki pemahaman kuat tentang standar peracikan obat dan sangat antusias untuk memberikan pelayanan kesehatan terbaik kepada pasien.";
                return "Lulusan baru yang bermotivasi tinggi, cepat belajar, dan sangat antusias untuk memulai perjalanan karier profesional. Siap memberikan kontribusi positif dan berkembang bersama perusahaan.";
            }
            if(r.includes('security')) return "Petugas Keamanan (Security) profesional dengan rekam jejak yang terbukti. Disiplin, sigap, dan menguasai prosedur patroli.";
            if(r.includes('developer')) return "Software Developer berdedikasi dengan keahlian merancang sistem efisien. Terbiasa memecahkan masalah kompleks dan menulis kode bersih.";
            if(r.includes('farmasi')) return "Tenaga Teknis Kefarmasian bersertifikat dengan ketelitian tinggi dalam peracikan dan pelayanan pasien.";
            return "Profesional bermotivasi tinggi dengan rekam jejak solid. Mudah beradaptasi, komunikatif, dan berorientasi pada efisiensi.";
        } else {
            if (!hasExp) return "Highly motivated and fast-learning fresh graduate, eager to kickstart a professional career. Ready to make a positive impact and grow with the company.";
            return "Highly motivated professional with a solid track record. Adaptable, communicative, and driven by operational efficiency.";
        }
    },
    
    generateCoverLetter(data) {
        const dateStr = new Date().toLocaleDateString(data.lang === 'id' ? 'id-ID' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const addrParts = (data.address || 'Kota').split(','); const city = addrParts.length > 1 ? addrParts[addrParts.length - 1].trim() : addrParts[0].trim();
        const ttdHTML = data.signature ? `<img src="${data.signature}" class="h-20 mt-4 mb-2 object-contain mix-blend-multiply">` : `<br><br><br><br>`;
        const mainColor = data.color || '#0ea5e9';
        const roleHTML = data.role ? `<h2 class="text-sm font-bold text-slate-500 uppercase tracking-widest mb-5">${data.role}</h2>` : '<div class="mb-5"></div>';
        const hasExp = data.experiences && data.experiences.some(e => e.title || e.company);

        // LOGIKA BARU: TUJUAN SURAT DINAMIS
        let recipientHTML = data.lang === 'id' ? 'Yth. HRD Manager<br>Di Tempat' : 'To: HR Manager<br>Company';
        if (data.recipient && data.recipient.trim() !== '') {
            // Mengubah enter menjadi <br> di HTML agar susunannya rapi ke bawah
            recipientHTML = data.recipient.replace(/\n/g, '<br>');
        }

        const p1Id = hasExp ? `Melalui surat ini, saya bermaksud menyampaikan ketertarikan saya untuk mengisi posisi <strong>${data.role || 'yang relevan'}</strong> di perusahaan yang Bapak/Ibu pimpin.` : `Melalui surat ini, saya bermaksud menyampaikan ketertarikan dan antusiasme saya untuk memulai karier pada posisi <strong>${data.role || 'yang relevan'}</strong> di perusahaan yang Bapak/Ibu pimpin.`;
        const p2Id = hasExp ? 'Sebagai referensi lebih lanjut mengenai kualifikasi, rekam jejak, serta portofolio saya, bersama surat ini telah saya lampirkan Curriculum Vitae (CV) secara terpisah.' : 'Meskipun saya baru akan memulai perjalanan karier profesional, saya memiliki fondasi pendidikan yang kuat serta kemauan keras untuk belajar. Sebagai bahan pertimbangan Bapak/Ibu, telah saya lampirkan Curriculum Vitae (CV).';
        const p1En = hasExp ? `I am writing to express my strong interest in the <strong>${data.role || 'open position'}</strong> at your esteemed company.` : `I am writing to express my enthusiasm to kickstart my career for the <strong>${data.role || 'open position'}</strong> at your esteemed company.`;
        const p2En = hasExp ? 'For further reference regarding my qualifications, track record, and portfolio, I have attached my Curriculum Vitae alongside this letter.' : 'Although I am at the beginning of my professional journey, I possess a solid educational foundation and a strong eagerness to learn. I have attached my Curriculum Vitae for your review.';

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
                    
                    <p class="text-sm mb-8 font-bold leading-relaxed">${recipientHTML}</p>
                    
                    <p class="text-sm mb-5">${data.lang === 'id' ? 'Dengan hormat,' : 'Dear Hiring Manager,'}</p>
                    <p class="text-sm mb-5 text-justify leading-relaxed">${data.lang === 'id' ? p1Id : p1En}</p>
                    
                    <div class="pl-4 border-l-4 py-1 mb-5" style="border-color: ${mainColor}; background: #f8fafc;">
                        <p class="text-sm text-justify leading-relaxed italic text-slate-700">${data.summary || 'Saya memiliki kompetensi yang sesuai dan siap memberikan kontribusi terbaik.'}</p>
                    </div>

                    <p class="text-sm mb-5 text-justify leading-relaxed">${data.lang === 'id' ? p2Id : p2En}</p>
                    <p class="text-sm mb-12 text-justify leading-relaxed">${data.lang === 'id' ? 'Besar harapan saya untuk dapat mendiskusikan peluang ini lebih lanjut dalam sesi wawancara. Atas perhatian dan waktu yang diberikan, saya ucapkan terima kasih.' : 'I sincerely hope to discuss this opportunity further in an interview. Thank you for your time and consideration.'}</p>
                    
                    <p class="text-sm font-semibold">${data.lang === 'id' ? 'Hormat saya,' : 'Sincerely,'}</p>
                    ${ttdHTML}
                    <p class="text-sm font-black uppercase tracking-wider" style="color: ${mainColor}">${data.name || 'Nama Lengkap'}</p>
                </div>
            </div>`;
    }
};
