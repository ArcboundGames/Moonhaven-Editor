export function getApiUrl() {
  return process.env.WIKI_API ?? '';
}

export function getWikiImagesPath() {
  return process.env.WIKI_IMAGES_PATH ?? '';
}

export function getStreamingDataPath() {
  return process.env.STREAMING_DATA_PATH ?? '';
}
