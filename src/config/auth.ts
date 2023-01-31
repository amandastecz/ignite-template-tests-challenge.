export default {
  jwt: {
    secret: process.env.JWT_SECRET as string || 'default=value',
    expiresIn: '1d'
  }
}
