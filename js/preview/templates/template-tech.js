export const TemplateTECH = {
    render(data) {
        return `
            <div class="bg-[#020617] text-cyan-400 font-mono min-h-[297mm] p-10 border-4 border-slate-800">
                <div class="border-b border-cyan-500/30 pb-4 mb-6">
                    <h1 class="text-4xl font-black text-white tracking-widest">> ${data.name || 'USER_NAME'}</h1>
                    <h2 class="text-lg text-emerald-400 mt-2">[ROLE: ${data.role || 'System Admin'}]</h2>
                    <p class="text-xs text-slate-400 mt-2">LINK: ${data.email || 'email'} | PING: ${data.phone || 'phone'}</p>
                </div>

                <div class="mb-6">
                    <h3 class="text-lg font-bold text-white uppercase bg-slate-800 inline-block px-2 py-1 mb-3">~./summary.sh</h3>
                    <p class="text-sm text-cyan-200 leading-relaxed">> ${data.summary || 'Executing bio...'}</p>
                </div>

                <div class="mb-6">
                    <h3 class="text-lg font-bold text-white uppercase bg-slate-800 inline-block px-2 py-1 mb-3">~./experience.log</h3>
                    <div class="border-l-2 border-cyan-500/50 pl-4">
                        <h4 class="text-base font-bold text-white">${data.jobTitle || 'Process Name'} <span class="text-xs text-slate-500 ml-2">@ ${data.jobCompany || 'Server'}</span></h4>
                        <p class="text-xs text-emerald-400 mb-2">[UPTIME: ${data.jobDate || 'Date'}]</p>
                        <p class="text-sm text-cyan-200">> Initialized system protocols and deployed scalable solutions.</p>
                    </div>
                </div>
            </div>
        `;
    }
};
