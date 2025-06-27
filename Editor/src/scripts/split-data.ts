import dotenv from 'dotenv';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { format } from 'prettier';

/**
 * Splits a combined JSON file into individual JSON files,
 * writing them to the specified input folder.
 *
 * @param combinedFilePath Path to the combined JSON file
 * @param outputDir Path to the folder where individual files will be written
 */
async function splitJsonFile(inputDir: string, outputDir: string, outputFileName = 'combined.json'): Promise<void> {
  try {
    const outputPath = join(inputDir, outputFileName);
    const fileContent = await readFile(outputPath, 'utf-8');
    const data: Record<string, unknown> = JSON.parse(fileContent);

    await mkdir(outputDir, { recursive: true });

    for (const [key, value] of Object.entries(data)) {
      const rawJson = JSON.stringify(value, null, 2);

      // Format using Prettier with JSON parser
      const formatted = format(rawJson, { parser: 'json' });

      const filePath = join(outputDir, `${key}.json`);
      await writeFile(filePath, formatted, 'utf-8');
      console.log(`Wrote and formatted: ${filePath}`);
    }

    console.log('Split complete.');
  } catch (err) {
    console.error('Error splitting JSON file:', err);
  }
}

(async () => {
  dotenv.config();

  const dataPath = process.env.STREAMING_DATA_PATH ?? '';
  const outputPath = process.env.COMBINED_DATA_PATH ?? '';

  await splitJsonFile(outputPath, dataPath);
})();
