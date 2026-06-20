# TODO

- [x] Create `.env` with VITE_API_URL and VITE_SOCKET_URL
- [x] Update `src/pages/MeetingRoom.jsx` to use `import.meta.env.VITE_API_URL` for `/join` and `/end`
- [x] Update `src/utils/socket.js` to use `import.meta.env.VITE_SOCKET_URL`
- [ ] Deploy/build and verify no remaining hardcoded `roomlybackend.onrender.com` URLs
- [ ] Add/confirm env vars in the Vercel dashboard (`VITE_API_URL`, `VITE_SOCKET_URL`)

