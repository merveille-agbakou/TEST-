import { HttpContext } from '@adonisjs/core/http'
import Evenement from '#models/evenement'

export default class EvenementsController {
  // Lister tous les événements non supprimés
  public async index({ response }: HttpContext) {
    const evenements = await Evenement.query().where('is_deleted', false).preload('creator')
    return response.ok(evenements)
  }

  // Créer un nouvel événement
  public async store({ request, response, auth }: HttpContext) {
    const user = auth.user
  
    if (!user) {
      return response.unauthorized({ message: 'Vous devez être connecté pour créer un événement.' })
    }
  
    // Récupérer les données de la requête
    const data = request.only(['title', 'place', 'description', 'startDate', 'endDate', 'status'])
  
    // Ajouter l'ID de l'utilisateur aux données de l'événement
    data.user_id = user.id
  
    // Créer l'événement
    const evenement = await Evenement.create(data)
  
    return response.created(evenement)
  }

  // Afficher un événement spécifique
  public async show({ params, response }: HttpContext) {
    const evenement = await Evenement.query()
      .where('id', params.id)
      .where('is_deleted', false)
      .preload('users')
      .firstOrFail()
    return response.ok(evenement)
  }

  // Mettre à jour un événement
  public async update({ params, request, response }: HttpContext) {
    const evenement = await Evenement.query()
      .where('id', params.id)
      .where('is_deleted', false)
      .firstOrFail()
    const data = request.only(['title', 'place', 'description', 'startDate', 'endDate', 'status'])
    evenement.merge(data)
    await evenement.save()
    return response.ok(evenement)
  }

  // Supprimer un événement (soft delete)
  public async destroy({ params, response }: HttpContext) {
    const evenement = await Evenement.findOrFail(params.id)
    evenement.is_deleted = true
    await evenement.save()
    return response.ok(evenement)
  }

  // Restaurer un événement supprimé
  public async restore({ params, response }: HttpContext) {
    const evenement = await Evenement.findOrFail(params.id)
    evenement.is_deleted = false
    await evenement.save()
    return response.ok(evenement)
  }
}