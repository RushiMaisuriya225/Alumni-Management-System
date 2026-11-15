import { Gallery } from '../models/Index.js';
import fs from 'fs';
import path from 'path';

export async function listGallery(req, res, next) {
    try { res.json(await Gallery.findAll({ order: [['id', 'DESC']] })); } catch (err) { next(err); }
}

export async function addGallery(req, res, next) {
    try {
        const relPath = path.relative(process.cwd(), req.file.path).replace(/\\/g, '/');
        const record = await Gallery.create({ image_path: relPath, about: req.body.about });
        res.status(201).json(record);
    } catch (err) { next(err); }
}

export async function deleteGallery(req, res, next) {
    try {
        const img = await Gallery.findByPk(req.params.id);
        if (img) {
            const abs = path.isAbsolute(img.image_path) ? img.image_path : path.join(process.cwd(), img.image_path);
            try { fs.unlinkSync(abs); } catch { /* file may be missing */ }
            await img.destroy();
        }
        res.json({ message: 'Deleted' });
    } catch (err) { next(err); }
}