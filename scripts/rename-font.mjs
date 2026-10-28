// Renames a font in its sfnt `name` table. The SIL OFL forbids a modified
// version (a subset counts) from using the Reserved Font Name, so the site
// subset must not call itself Pretendard. Copyright, trademark and license
// records stay as they are; OFL requires keeping them.
const KEPT_NAME_IDS = new Set([0, 7, 13, 14]);

function tableDirectory(font) {
	const count = font.readUInt16BE(4);
	return Array.from({ length: count }, (_, i) => {
		const at = 12 + i * 16;
		const offset = font.readUInt32BE(at + 8);
		const length = font.readUInt32BE(at + 12);
		return { tag: font.toString('latin1', at, at + 4), data: font.subarray(offset, offset + length) };
	});
}

function checksum(data) {
	const padded = Buffer.alloc(Math.ceil(data.length / 4) * 4);
	data.copy(padded);
	let sum = 0;
	for (let i = 0; i < padded.length; i += 4) sum = (sum + padded.readUInt32BE(i)) >>> 0;
	return sum;
}

// Windows (3) and Unicode (0) platform strings are UTF-16BE; Mac (1) is 8-bit.
const decode = (platform, raw) =>
	platform === 1 ? raw.toString('latin1') : Buffer.from(raw).swap16().toString('utf16le');
const encode = (platform, text) =>
	platform === 1 ? Buffer.from(text, 'latin1') : Buffer.from(text, 'utf16le').swap16();

function renameTable(name, replace) {
	const count = name.readUInt16BE(2);
	const storage = name.readUInt16BE(4);
	const records = [];
	const strings = [];
	let offset = 0;
	for (let i = 0; i < count; i++) {
		const at = 6 + i * 12;
		const [platform, encoding, language, nameId, length, start] = [0, 2, 4, 6, 8, 10].map((k) =>
			name.readUInt16BE(at + k),
		);
		const raw = name.subarray(storage + start, storage + start + length);
		const text = KEPT_NAME_IDS.has(nameId) ? raw : encode(platform, replace(decode(platform, raw)));
		records.push([platform, encoding, language, nameId, text.length, offset]);
		strings.push(text);
		offset += text.length;
	}
	// Format 0 only: subset-font output has no language-tag records.
	const header = Buffer.alloc(6 + count * 12);
	header.writeUInt16BE(0, 0);
	header.writeUInt16BE(count, 2);
	header.writeUInt16BE(header.length, 4);
	records.forEach((fields, i) => fields.forEach((v, k) => header.writeUInt16BE(v, 6 + i * 12 + k * 2)));
	return Buffer.concat([header, ...strings]);
}

/** Returns a new sfnt whose naming strings pass through `replace`. */
export function renameFont(font, replace) {
	const tables = tableDirectory(font).map((table) =>
		table.tag === 'name' ? { ...table, data: renameTable(table.data, replace) } : table,
	);
	const headerLength = 12 + tables.length * 16;
	const header = Buffer.alloc(headerLength);
	font.copy(header, 0, 0, 12);
	const bodies = [];
	let offset = headerLength;
	tables.forEach((table, i) => {
		const data = table.tag === 'head' ? Buffer.from(table.data) : table.data;
		if (table.tag === 'head') data.writeUInt32BE(0, 8); // checkSumAdjustment, set below
		const at = 12 + i * 16;
		header.write(table.tag, at, 'latin1');
		header.writeUInt32BE(checksum(data), at + 4);
		header.writeUInt32BE(offset, at + 8);
		header.writeUInt32BE(data.length, at + 12);
		const padded = Buffer.alloc(Math.ceil(data.length / 4) * 4);
		data.copy(padded);
		bodies.push(padded);
		offset += padded.length;
	});
	const result = Buffer.concat([header, ...bodies]);
	const head = tables.findIndex((table) => table.tag === 'head');
	if (head >= 0) {
		const headOffset = result.readUInt32BE(12 + head * 16 + 8);
		result.writeUInt32BE((0xb1b0afba - checksum(result)) >>> 0, headOffset + 8);
	}
	return result;
}

/** Reads every naming string as `nameId: text`, for checks and tests. */
export function readNames(font) {
	const name = tableDirectory(font).find((table) => table.tag === 'name').data;
	const storage = name.readUInt16BE(4);
	return Array.from({ length: name.readUInt16BE(2) }, (_, i) => {
		const at = 6 + i * 12;
		const [platform, , , nameId, length, start] = [0, 2, 4, 6, 8, 10].map((k) => name.readUInt16BE(at + k));
		return { nameId, text: decode(platform, name.subarray(storage + start, storage + start + length)) };
	});
}
