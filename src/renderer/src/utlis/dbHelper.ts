function convertId(idObj) {
  // if (!idObj) return null
  const bytes = idObj?.buffer
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export { convertId }
