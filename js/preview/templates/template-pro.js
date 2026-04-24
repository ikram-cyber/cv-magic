export const TemplatePRO = {
    render(data) {
        // Foto rendering dengan warna dasar pas foto formal elegan
        const photoHTML = data.photo 
            ? `<div class="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-slate-700 shadow-lg" style="background-color: #0C0CF6;"><img src="${data.photo}" class="w-full h-full object-cover"></div>` 
            : `<div class="w-32 h-32 mx-auto mb-6 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center shadow-lg"><i class="fas fa-user text-4xl text-slate-500"></i></div>`;

        // Looping pengalaman dinamis
        const expsHTML = (data.experiences || []).map(exp => `
            <div class="mb-4">
                <h4 class="text-base font-bold text-slate-900">${exp.title || '-'}</h4>
                <div class="flex justify-between text-sm font-bold text-cyan-600 mb-1">
                    <span>${exp.company || '-'}</span>
                    <span class="text-slate-500 text-xs">${exp.date || '-'}</span>
                </div>
            </div>
        `).join('');

        return `
            <div class="flex h-full min-h-[297mm]">
                <div class="w-1/3 bg-slate-900 text-white p-6 pt-10 text-center">
                    ${photoHTML}
                    <h1 class="text-2xl font-black text-cyan-400 mb-1 leading-tight">${data.name || 'Nama'}</h1>
                    <h2 class="text-xs text-slate-400 font-medium mb-8">${data.role || 'Posisi'}</h2>
                    
                    <div class="text-left">
                        <h3 class="text-[10px] font-bold text-cyan-500 uppercase tracking-widest border-b border-slate-700 pb-1 mb-3">Kontak</h3>
                        <div class="text-xs text-slate-300 space-y-3 mb-8">
                            <p class="flex items-center gap-2"><i class="fas fa-envelope text-cyan-500"></i> <span class="break-all">${data.email || 'email'}</span></p>
                            <p class="flex items-center gap-2"><i class="fas fa-phone text-cyan-500"></i> ${data.phone || '08xx'}</p>
                        </div>
                    </div>
                </div>
                <div class="w-2/3 bg-white p-10">
                    <h3 class="text-lg font-black text-slate-800 uppercase tracking-widest border-b-2 border-cyan-500 pb-1 mb-4">Profil Profesional</h3>
                    <p class="text-sm text-slate-600 leading-relaxed text-justify mb-8">${data.summary || 'Tulis profil Anda...'}</p>

                    <h3 class="text-lg font-black text-slate-800 uppercase tracking-widest border-b-2 border-cyan-500 pb-1 mb-5">Pengalaman Kerja</h3>
                    ${expsHTML}
                </div>
            </div>
        `;
    }
};
