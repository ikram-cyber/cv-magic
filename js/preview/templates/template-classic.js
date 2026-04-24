export const TemplateCLASSIC = {
    render(data) {
        const photoHTML = data.photo 
            ? `<img src="${data.photo}" class="w-[3cm] h-[4cm] object-cover border border-slate-300">` 
            : `<div class="w-[3cm] h-[4cm] bg-slate-200 border border-slate-300 flex items-center justify-center text-xs text-slate-500 text-center">Pas Foto<br>3x4</div>`;

        const expsHTML = (data.experiences || []).map(exp => `
            <div class="mb-3">
                <div class="font-bold text-sm text-slate-900">${exp.company || '-'} – ${exp.date || '-'}</div>
                <ul class="list-disc list-outside ml-5 text-sm text-slate-800 mt-1">
                    <li>${exp.title || '-'}</li>
                </ul>
            </div>
        `).join('');

        const formatList = (text) => {
            if (!text) return '<li>-</li>';
            return text.split('\n').filter(t => t.trim() !== '').map(t => `<li>${t}</li>`).join('');
        };

        return `
            <div class="p-10 font-sans text-slate-900 bg-white min-h-[297mm]">
                <div class="flex gap-6 mb-6">
                    <div class="shrink-0">${photoHTML}</div>
                    <div class="flex-1 pt-2">
                        <h2 class="font-bold text-sm mb-4 uppercase">CURRICULUM VITAE (CV)</h2>
                        <h3 class="font-bold text-sm mb-2">DATA PRIBADI</h3>
                        <table class="text-sm w-full">
                            <tr>
                                <td class="w-20 pb-2 font-bold align-top pt-0.5"><span class="inline-block w-1.5 h-1.5 bg-black rounded-full mr-2 align-middle mb-0.5"></span>Nama</td>
                                <td class="w-3 pb-2 align-top pt-0.5">:</td>
                                <td class="pb-2 align-top pt-0.5">${data.name || '-'}</td>
                            </tr>
                            <tr>
                                <td class="w-20 pb-2 font-bold align-top pt-0.5"><span class="inline-block w-1.5 h-1.5 bg-black rounded-full mr-2 align-middle mb-0.5"></span>No. HP</td>
                                <td class="w-3 pb-2 align-top pt-0.5">:</td>
                                <td class="pb-2 align-top pt-0.5">${data.phone || '-'}</td>
                            </tr>
                            <tr>
                                <td class="w-20 pb-2 font-bold align-top pt-0.5"><span class="inline-block w-1.5 h-1.5 bg-black rounded-full mr-2 align-middle mb-0.5"></span>Alamat</td>
                                <td class="w-3 pb-2 align-top pt-0.5">:</td>
                                <td class="pb-2 align-top pt-0.5 leading-relaxed text-justify pr-4">${data.address || '-'}</td>
                            </tr>
                        </table>
                    </div>
                </div>

                <hr class="border-t-2 border-slate-300 mb-2">
                <h3 class="font-bold text-sm mb-2">PROFIL</h3>
                <p class="text-sm text-justify mb-6 leading-relaxed">${data.summary || '-'}</p>

                <hr class="border-t-2 border-slate-300 mb-2">
                <h3 class="font-bold text-sm mb-2">PENGALAMAN KERJA</h3>
                <div class="mb-6">${expsHTML}</div>

                <hr class="border-t-2 border-slate-300 mb-2">
                <h3 class="font-bold text-sm mb-2">KEAHLIAN UTAMA</h3>
                <ul class="list-disc list-outside ml-5 text-sm mb-6 space-y-1">
                    ${formatList(data.skills)}
                </ul>

                <hr class="border-t-2 border-slate-300 mb-2">
                <h3 class="font-bold text-sm mb-2">PENDIDIKAN & SERTIFIKAT</h3>
                <ul class="list-disc list-outside ml-5 text-sm mb-6 space-y-1">
                    ${formatList(data.education)}
                </ul>
            </div>
        `;
    }
};
