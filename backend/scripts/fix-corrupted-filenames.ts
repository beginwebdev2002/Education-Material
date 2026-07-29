import mongoose, { Schema } from 'mongoose';
import { sanitizeOriginalName } from '../src/common/utils/filename.util';

/**
 * One-off backfill: re-derives `originalName` for previously-uploaded materials
 * whose filename was corrupted by the latin1/utf8 multer bug (see materials-multer.config.ts).
 *
 * Dry-run by default — pass --apply to actually write changes.
 * Usage: node --env-file=.env -r ts-node/register scripts/fix-corrupted-filenames.ts [--apply]
 */

const MaterialSchema = new Schema({ originalName: String }, { collection: 'materials', strict: false });
const Material = mongoose.model('MaterialBackfill', MaterialSchema);

async function main(): Promise<void> {
    const apply = process.argv.includes('--apply');
    const uri = process.env.DATABASE_HOST;
    if (!uri) {
        throw new Error('DATABASE_HOST is not set');
    }

    await mongoose.connect(uri);

    const materials = await Material.find({ originalName: { $exists: true } }, { originalName: 1 }).lean();
    let changed = 0;

    for (const material of materials) {
        const before = material.originalName as string;
        const after = sanitizeOriginalName(before);
        if (after === before) {
            continue;
        }

        changed += 1;
        console.log(`${apply ? 'FIXING' : 'DRY-RUN'}: "${before}" -> "${after}"`);

        if (apply) {
            await Material.updateOne({ _id: material._id }, { $set: { originalName: after } });
        }
    }

    console.log(`\n${changed} of ${materials.length} material(s) would be updated.`);
    if (!apply) {
        console.log('Re-run with --apply to write these changes.');
    }

    await mongoose.disconnect();
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
