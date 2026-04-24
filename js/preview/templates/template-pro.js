export const TemplatePRO = {
    render(data) {
        return `
            <div class="flex h-full min-h-[297mm]">
                <div class="w-1/3 bg-slate-900 text-white p-6">
                    <h1 class="text-3xl font-black text-cyan-400 mb-1">${data.name || 'Nama'}</h1>
                    <h2 class="text-sm text-slate-300 font-medium mb-8">${data.role || 'Posisi'}</h2>
                    
                    <h3 class="text-xs font-bold text-cyan-500 uppercase tracking-widest border-b border-slate-700 pb-1 mb-3">Kontak</h3>
                    <div class="text-xs text-slate-300 space-y-2 mb-8">
                        <p><i class="fas fa-envelope w-4"></i> ${data.email || 'email@domain.com'}</p>
                        <p><i class="fas fa-phone w-4"></i> ${data.phone || '08xx-xxxx'}</p>
                    </div>

                    <h3 class="text-xs font-bold text-cyan-500 uppercase tracking-widest border-b border-slate-700 pb-1 mb-3">Keahlian</h3>
                    <p class="text-xs text-slate-300 leading-relaxed">
                        Medical: Farmasi, Standar SOP.<br><br>
                        Tech: JavaScript, Firebase, Node.js, GitHub.
                    </p>
                </div>

                <div class="w-2/3 bg-white p-8">
                    <h3 class="text-lg font-black text-slate-800 uppercase tracking-widest border-b-2 border-cyan-500 pb-1 mb-3">Profil</h3>
                    <p class="text-sm text-slate-600 leading-relaxed text-justify mb-8">${data.summary || 'Tulis profil Anda...'}</p>

                    <h3 class="text-lg font-black text-slate-800 uppercase tracking-widest border-b-2 border-cyan-500 pb-1 mb-4">Pengalaman Kerja</h3>
                    <div>
                        <h4 class="text-base font-bold text-slate-900">${data.jobTitle || 'Jabatan'}</h4>
                        <div class="flex justify-between text-sm font-bold text-cyan-600 mb-2">
                            <span>${data.jobCompany || 'Perusahaan'}</span>
                            <span class="text-slate-500 text-xs">${data.jobDate || 'Periode'}</span>
                        </div>
                        <ul class="list-disc list-outside ml-4 text-sm text-slate-600 space-y-1">
                            <li>Mengembangkan dan memelihara sistem operasional harian.</li>
                            <li>Berinovasi dalam pemanfaatan teknologi untuk efisiensi bisnis.</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }
};
