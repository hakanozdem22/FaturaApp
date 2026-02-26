import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    // Add any APIs to expose here
});
