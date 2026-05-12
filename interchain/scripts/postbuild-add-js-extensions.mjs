#!/usr/bin/env node
// Rewrites relative imports/exports in dist/ to include .js extensions.
// Required for Node native ESM consumers — tsc emits extensionless paths.
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { existsSync } from 'node:fs';

const root = resolve(process.argv[2] ?? 'dist');

const importRe = /(import\s+(?:[\s\S]+?\s+from\s+)?|export\s+(?:[\s\S]+?\s+from\s+)?|import\()\s*(['"])(\.\.?\/[^'"\s]+?)\2/g;

async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = [];
    for (const e of entries) {
        const full = join(dir, e.name);
        if (e.isDirectory()) files.push(...(await walk(full)));
        else if (e.isFile() && (full.endsWith('.js') || full.endsWith('.d.ts'))) files.push(full);
    }
    return files;
}

async function resolveTarget(fromFile, spec) {
    if (spec.endsWith('.js') || spec.endsWith('.d.ts') || spec.endsWith('.json')) return spec;
    const base = resolve(dirname(fromFile), spec);
    if (existsSync(`${base}.js`)) return `${spec}.js`;
    try {
        const s = await stat(base);
        if (s.isDirectory() && existsSync(join(base, 'index.js'))) return `${spec}/index.js`;
    } catch { /* not a dir */ }
    return spec; // leave untouched if we can't resolve
}

let touched = 0;
for (const file of await walk(root)) {
    const src = await readFile(file, 'utf8');
    let changed = false;
    const out = [];
    let last = 0;
    for (const m of src.matchAll(importRe)) {
        const [whole, head, quote, spec] = m;
        const newSpec = await resolveTarget(file, spec);
        out.push(src.slice(last, m.index));
        if (newSpec !== spec) {
            out.push(`${head}${quote}${newSpec}${quote}`);
            changed = true;
        } else {
            out.push(whole);
        }
        last = m.index + whole.length;
    }
    out.push(src.slice(last));
    if (changed) {
        await writeFile(file, out.join(''));
        touched++;
    }
}
console.log(`postbuild-add-js-extensions: updated ${touched} files under ${root}`);
