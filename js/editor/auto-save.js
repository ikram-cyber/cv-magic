import { State } from '../core/state.js';

export const AutoSave = {
    init() {
        // Cek apakah ada data tersimpan di HP/Browser
        const savedData = localStorage.getItem('documagic_data');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            State.data = { ...State.data, ...parsed };
        }
        
        // Simpan setiap kali ada perubahan
        State.subscribe((newData) => {
            localStorage.setItem('documagic_data', JSON.stringify(newData));
        });
    }
};
