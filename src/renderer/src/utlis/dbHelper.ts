function convertId(idObj) {
  const bytes = idObj.buffer
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export { convertId }
