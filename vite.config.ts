import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins:[react()], base:'/ict-smo-club-dashboard/', test:{environment:'node'} });
