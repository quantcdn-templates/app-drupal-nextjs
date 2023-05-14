export function formatDate(input: string): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function absoluteUrl(input: string) {
  // Note: NEXT_PUBLIC_IMAGE_DOMAIN will be empty in Quant Cloud as relative paths are desired.
  return `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}${input}`
}
