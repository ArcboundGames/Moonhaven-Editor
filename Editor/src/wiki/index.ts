console.error('The wiki command is split into wiki:build, wiki:assets, and wiki:publish.');
console.error('Content work must run wiki:build and wiki:assets --check, then ask before wiki:publish --confirm.');
process.exitCode = 1;
