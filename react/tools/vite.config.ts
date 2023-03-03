import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';

export default defineConfig({
	plugins: [react()],
	server: {
		hmr: {
			port: VITE_PROXY_PORT,
			path: 'mysocket/?transport=polling'
		},
		host: 'VITE_HOSTNAME',
		port: VITE_FRONT_PORT,
		https: {
			key: fs.readFileSync('/usr/src/app/ft_transcendence/ssl_key/ft_transcendence.key.pem'),
			cert: fs.readFileSync('/usr/src/app/ft_transcendence/ssl_key/ft_transcendence-x509.crt'),
		},
	},
})
