import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsersController {
  // Lister tous les utilisateurs
  public async index({ response }: HttpContext) {
    const users = await User.query().preload('evenements')
    return response.ok(users)
  }

  // Créer un nouvel utilisateur
  public async store({ request, response }: HttpContext) {
    const data = request.only(['firstname', 'lastname', 'email', 'password', 'role'])
    const user = await User.create(data)
    return response.created(user)
  }

  // Afficher un utilisateur spécifique
  public async show({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.load('evenements')
    return response.ok(user)
  }

  // Mettre à jour un utilisateur
  public async update({ params, request, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const data = request.only(['firstname', 'lastname', 'email', 'password', 'role'])
    user.merge(data)
    await user.save()
    return response.ok(user)
  }

  // Supprimer un utilisateur
  public async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    return response.ok(user)
  }
}