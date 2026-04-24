export const Magic = {
    // 1. Kamus Bilingual
    dict: {
        id: { cv: "CURRICULUM VITAE", name: "Nama", dob: "Tempat, Tgl Lahir", phone: "No. HP", address: "Alamat", profile: "PROFIL", exp: "PENGALAMAN KERJA", skills: "KEAHLIAN UTAMA", edu: "PENDIDIKAN & SERTIFIKAT" },
        en: { cv: "CURRICULUM VITAE", name: "Name", dob: "Date of Birth", phone: "Phone", address: "Address", profile: "PROFESSIONAL PROFILE", exp: "WORK EXPERIENCE", skills: "CORE COMPETENCIES", edu: "EDUCATION & CERTIFICATIONS" }
    },
    
    // 2. AI Writer (Pembuat Kata Otomatis berdasarkan Pekerjaan)
    generateSummary(role, lang) {
        const r = (role || '').toLowerCase();
        if(lang === 'id') {
            if(r.includes('security') || r.includes('keamanan')) return "Petugas Keamanan (Security) profesional dengan rekam jejak yang terbukti dalam menjaga keamanan aset, personel, dan fasilitas. Disiplin, sigap dalam keadaan darurat, dan menguasai prosedur patroli serta kontrol akses.";
            if(r.includes('developer') || r.includes('programmer')) return "Software Developer yang berdedikasi dengan keahlian dalam merancang dan membangun aplikasi sistem yang efisien. Terbiasa memecahkan masalah kompleks dan menulis kode yang bersih serta mudah dikembangkan.";
            if(r.includes('farmasi') || r.includes('apoteker')) return "Tenaga Teknis Kefarmasian bersertifikat yang memiliki ketelitian tinggi dalam peracikan, manajemen stok obat, dan pelayanan pasien sesuai standar kesehatan yang ketat.";
            return "Profesional yang bermotivasi tinggi dengan rekam jejak yang solid. Mudah beradaptasi, memiliki kemampuan komunikasi yang baik, dan selalu berorientasi pada target serta efisiensi operasional perusahaan.";
        } else {
            if(r.includes('security')) return "Professional Security Officer with a proven track record of maintaining a safe and secure environment. Highly disciplined, responsive to emergencies, and experienced in access control.";
            if(r.includes('developer')) return "Dedicated Software Developer with expertise in designing and building efficient systems. Adept at solving complex problems and writing clean, scalable code.";
            if(r.includes('farmasi')) return "Certified Pharmacy Technician with high accuracy in medication dispensing, inventory management, and patient care compliance.";
            return "Highly motivated professional with a solid track record. Adaptable, communicative, and constantly driven by operational efficiency and company targets.";
        }
    },

    // 3. Cover Letter Generator (Surat Lamaran Otomatis)
    generateCoverLetter(data) {
        const t = this.dict[data.lang];
        const dateStr = new Date().toLocaleDateString(data.lang === 'id' ? 'id-ID' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const city = (data.address || 'Kota').split(',')[0];
        
        if (data.lang === 'id') {
            return `
                <div class="p-10 font-sans text-slate-900 bg-white min-h-[297mm]">
                    <p class="text-right text-sm mb-10">${city}, ${dateStr}</p>
                    <p class="text-sm mb-6">Yth. HRD Manager<br>Di Tempat</p>
                    <p class="text-sm mb-4">Dengan hormat,</p>
                    <p class="text-sm mb-4 text-justify leading-relaxed">Berdasarkan informasi yang saya peroleh, perusahaan yang Bapak/Ibu pimpin saat ini sedang membuka lowongan pekerjaan. Melalui surat ini, saya bermaksud melamar pekerjaan pada posisi <strong>${data.role || 'yang sesuai dengan keahlian saya'}</strong>.</p>
                    <p class="text-sm mb-4 text-justify leading-relaxed">Nama saya ${data.name || '...'}, memiliki latar belakang di bidang terkait dan rekam jejak yang baik. ${data.summary || ''}</p>
                    <p class="text-sm mb-4 text-justify leading-relaxed">Sebagai bahan pertimbangan, saya telah melampirkan Curriculum Vitae (CV) ini. Saya memiliki motivasi tinggi untuk berkontribusi pada kemajuan perusahaan Bapak/Ibu dan sangat berharap dapat diberikan kesempatan wawancara.</p>
                    <p class="text-sm mb-12">Atas perhatian dan waktu Bapak/Ibu, saya ucapkan terima kasih.</p>
                    <p class="text-sm">Hormat saya,</p><br><br>
                    <p class="text-sm font-bold">${data.name || 'Nama Lengkap'}</p>
                </div>`;
        } else {
            return `
                <div class="p-10 font-sans text-slate-900 bg-white min-h-[297mm]">
                    <p class="text-right text-sm mb-10">${city}, ${dateStr}</p>
                    <p class="text-sm mb-6">To: HR Manager<br>Company</p>
                    <p class="text-sm mb-4">Dear Hiring Manager,</p>
                    <p class="text-sm mb-4 text-justify leading-relaxed">I am writing to express my interest in the <strong>${data.role || 'open position'}</strong> at your esteemed company. With a solid background and relevant experience, I am confident in my ability to contribute effectively to your team.</p>
                    <p class="text-sm mb-4 text-justify leading-relaxed">My name is ${data.name || '...'}, and ${data.summary || ''}</p>
                    <p class="text-sm mb-4 text-justify leading-relaxed">I have attached my Curriculum Vitae for your review. I am highly motivated to bring my skills to your company and welcome the opportunity to discuss how my qualifications align with your needs in an interview.</p>
                    <p class="text-sm mb-12">Thank you for your time and consideration.</p>
                    <p class="text-sm">Sincerely,</p><br><br>
                    <p class="text-sm font-bold">${data.name || 'Nama Lengkap'}</p>
                </div>`;
        }
    }
};
