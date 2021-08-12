import sharp from 'sharp'

export async function sharpMin(path: string) {
  const buffer = await sharp(path)
    .resize(1000, 1000, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .toBuffer()
  return await sharp(buffer).toFile(path)
}
