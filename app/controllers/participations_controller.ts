import Evenement from '#models/evenement'
import User from '#models/user'
import UserEvent from '#models/user_event'
import type { HttpContext } from '@adonisjs/core/http'

export default class ParticipationsController {

  public async index({ response }: HttpContext) {
    const evenements = await UserEvent.query().preload('users').preload('evenements')
    return response.ok(evenements)
  }

  // Inscrire un utilisateur à un événement
  public async store({ request, response }: HttpContext) {
    const { firstname, lastname, email, eventId } = request.only(['firstname', 'lastname', 'email', 'eventId'])

    if (!firstname || !lastname || !email) {
      return response.badRequest({ message: 'Tous les champs sont obligatoires.' })
    }

    // Vérifier si l'utilisateur existe déjà
    let user = await User.findBy('email', email)

    // S'il n'existe pas, on le crée
    if (!user) {
      user = await User.create({ firstname, lastname, email })
    }

    // Récupérer l'événement
    const evenement = await Evenement.findOrFail(eventId)

    // Vérifier si l'événement est actif et non supprimé
    if (evenement.is_deleted || evenement.status !== 'actif') {
      return response.badRequest({ message: "Cet événement n'est pas disponible." })
    }

    // Vérifier si l'utilisateur est déjà inscrit à cet événement
    const existingParticipation = await UserEvent.query()
      .where('user_id', user.id)
      .where('evenement_id', eventId)
      .first()

    if (existingParticipation) {
      return response.badRequest({ message: 'Vous êtes déjà inscrit à cet événement.' })
    }

    // Vérifier si le nombre de places disponibles est suffisant
    const participantsCount = await UserEvent.query()
      .where('evenement_id', eventId)
      .count('* as total')

    if (Number(participantsCount[0].$extras.total) >= evenement.place) {
      return response.badRequest({ message: "Le nombre de places disponibles est atteint." })
    }

    // Enregistrer la participation
    await UserEvent.create({
      user_id: user.id,
      evenement_id: eventId,
    })

    return response.status(201).json({ message: 'Inscription réussie.' })
  }
}
