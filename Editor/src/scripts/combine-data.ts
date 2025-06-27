import dotenv from 'dotenv';
import { mkdir, readdir, readFile, writeFile } from 'fs/promises';
import { basename, join } from 'path';

/**
 * Combines all JSON files in a given input directory into a single object
 * and writes it to a specified output directory.
 *
 * @param inputDir Path to the folder containing JSON files
 * @param outputDir Path to the folder where the combined JSON should be saved
 * @param outputFileName Name of the output JSON file (default: combined.json)
 */
async function combineJsonFiles(inputDir: string, outputDir: string, outputFileName = 'combined.json'): Promise<void> {
  try {
    const files = await readdir(inputDir);
    const jsonFiles = files.filter((file) => file.endsWith('.json'));

    const combined: Record<string, unknown> = {};

    for (const file of jsonFiles) {
      const filePath = join(inputDir, file);
      const fileContent = await readFile(filePath, 'utf-8');
      const parsed = JSON.parse(fileContent);
      const key = basename(file, '.json');
      combined[key] = parsed;
    }

    await mkdir(outputDir, { recursive: true });
    const outputPath = join(outputDir, outputFileName);
    await writeFile(outputPath, JSON.stringify(combined, null, 2), 'utf-8');

    console.log(`Combined JSON written to: ${outputPath}`);
  } catch (err) {
    console.error('Error combining JSON files:', err);
  }
}

(async () => {
  dotenv.config();

  const dataPath = process.env.STREAMING_DATA_PATH ?? '';
  const outputPath = process.env.COMBINED_DATA_PATH ?? '';

  await combineJsonFiles(dataPath, outputPath);
})();
