export const TemplateATS = {
    render(data) {
        return `
            <div class="border-b-2 border-slate-800 pb-4 mb-6 text-center">
                <h1 class="text-4xl font-black text-slate-900 tracking-tight mb-1">${data.name || 'Nama Lengkap'}</h1>
                <h2 class="text-xl font-medium text-slate-600 mb-2">${data.role || 'Posisi Pekerjaan'}</h2>
                <div class="flex justify-center gap-4 text-sm text-slate-500">
                    <span>${data.email || 'email@domain.com'}</span> | 
                    <span>${data.phone || '08xx-xxxx-xxxx'}</span>
                </div>
            </div>

            <div class="mb-6">
                <h3 class="text-lg font-bold text-slate-800 uppercase tracking-widest border-b border-slate-300 pb-1 mb-3">Ringkasan Profesional</h3>
                <p class="text-sm text-slate-700 leading-relaxed text-justify">${data.summary || 'Tulis ringkasan tentang dirimu di sini...'}</p>
            </div>

            <div class="mb-6">
                <h3 class="text-lg font-bold text-slate-800 uppercase tracking-widest border-b border-slate-300 pb-1 mb-3">Pengalaman Inti</h3>
                <div class="mb-4">
                    <div class="flex justify-between items-baseline mb-1">
                        <h4 class="text-base font-bold text-slate-900">${data.jobTitle || 'Nama Jabatan'}</h4>
                        <span class="text-sm font-medium text-slate-500">${data.jobDate || 'Bulan Tahun - Bulan Tahun'}</span>
                    </div>
                    <h5 class="text-sm font-bold text-cyan-600 mb-2">${data.jobCompany || 'Nama Perusahaan'}</h5>
                    <ul class="list-disc list-outside ml-4 text-sm text-slate-700 space-y-1">
                        <li>Mengelola operasional harian dan memastikan standar operasional prosedur terpenuhi.</li>
                        <li>Mengembangkan solusi teknologi untuk mempercepat proses pencatatan dan administrasi.</li>
                    </ul>
                </div>
            </div>
            
            <div class="mb-6">
                <h3 class="text-lg font-bold text-slate-800 uppercase tracking-widest border-b border-slate-300 pb-1 mb-3">Keahlian (Skills)</h3>
                <p class="text-sm text-slate-700 leading-relaxed">
                    <span class="font-bold">Medical:</span> Standar Kefarmasian, Pelayanan Resep, Food Safety.<br>
                    <span class="font-bold">Tech:</span> JavaScript (Node.js/Vanilla), MongoDB, Pine Script, Firebase, Git.
                </p>
            </div>
        `;
    }
};
