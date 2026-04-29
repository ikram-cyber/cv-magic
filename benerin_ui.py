import os, re

def benerin_ui(nama_file, id_tombol, teks_tombol, ikon):
    if not os.path.exists(nama_file): return
    with open(nama_file, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Hapus footer lama dan tombol raksasa dengan aman
    html = re.sub(r'<footer.*?</footer>', '', html, flags=re.DOTALL)
    html = re.sub(r'<button id="' + id_tombol + r'".*?</button>', '', html, flags=re.DOTALL)
    
    # 2. Cegah duplikat kalau script dijalanin 2 kali
    html = re.sub(r'.*?</section>', '</section>', html, flags=re.DOTALL)

    # 3. Kode Tombol Melayang & Footer Premium Baru
    suntikan = f'''<div class="mt-8 pt-6 border-t border-slate-700/50 pb-8 w-full">
            <button id="{id_tombol}" class="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3.5 rounded-2xl shadow-[0_10px_25px_rgba(14,165,233,0.3)] border border-sky-400/50 flex items-center justify-center gap-3 transition-all active:scale-95">
                <i class="fas {ikon} text-lg"></i> {teks_tombol}
            </button>
            <div class="w-full text-center mt-6">
                <p class="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">
                    &copy; 2026 <a href="https://ikram-cyber.web.id" target="_blank" class="text-sky-500 hover:text-sky-300 transition-all">IKRAM CYBER</a>
                </p>
                <p class="text-[8px] text-slate-600 mt-1 uppercase tracking-widest">
                    Crafted with <i class="fas fa-code text-sky-600"></i> for Career Excellence
                </p>
            </div>
        </div>
    </section>'''

    # 4. Suntik ke titik yang 100% aman (tepat sebelum panel preview)
    html = re.sub(r'</section>\s*<section id="panel-preview"', suntikan + '\n\n        <section id="panel-preview"', html)

    with open(nama_file, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"✅ {nama_file} berhasil diperbaiki 100% Sempurna!")

print("\n🚀 Menjalankan Robot UI Ikram Cyber...\n")
benerin_ui('index.html', 'btn-export-cv', 'DOWNLOAD PDF CV', 'fa-print')
benerin_ui('Slamaran.html', 'btn-export-surat', 'DOWNLOAD PDF SURAT', 'fa-file-pdf')
print("\n🔥 SEMUA SELESAI! Tinggal Push ke GitHub! 🔥\n")
