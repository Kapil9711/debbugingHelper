export const config = {
  port: process.env.DEBUG_SERVER_PORT ? Number(process.env.DEBUG_SERVER_PORT) : 5600,
  // Allow all origins
  allowedOrigins: '*'
}
