import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  // Inscription
  public async register({ request, response }: HttpContext) {
    const data = request.only(['firstname', 'lastname', 'email', 'password', 'role'])
    const user = await User.create(data)
    return response.status(201).json(user)
  }

  // Connexion
  public async login({ request, response, auth }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    console.log(email, password)

    // Vérifier si l'utilisateur existe
    const userInUserTable = await User.findBy('email', email)
      if (!userInUserTable) {
        return response
          .status(404)
          .json({ message: "Cet email n'existe pas !" })
      }

    const verified = await User.verifyCredentials(email, password)
    if (!verified) {
      return response.status(401).json({ message: 'Mot de passe incorrect !' })
    }
    try {
      await auth.use('web').login(verified)
      return response.ok(verified)
    } catch {
      return response.status(400).json({ message: 'Invalid credentials' })
    }
  }

  // Déconnexion
  public async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.status(204)
  }
}