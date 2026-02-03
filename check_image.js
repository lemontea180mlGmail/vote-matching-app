
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'public/ogp.png');
const fd = fs.openSync(filePath, 'r');
const buffer = Buffer.alloc(24);
fs.readSync(fd, buffer, 0, 24, 0);
fs.closeSync(fd);

const width = buffer.readUInt32BE(16);
const height = buffer.readUInt32BE(20);

console.log(`Dimensions: ${width}x${height}`);
