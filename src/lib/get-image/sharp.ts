import sharp from 'sharp'

export async function sharpMin(path: string) {
  const buffer = await sharp(path)
    .resize(1500, 1500, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .toBuffer()
  return await sharp(buffer).toFile(path)
}
