import io from 'socket.io-client';

export const URL = 'https://chat.r-words.com';
export const socket = io(URL);
