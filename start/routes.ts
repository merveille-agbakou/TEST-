/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import EvenementsController from '#controllers/evenements_controller'
import AuthController from '#controllers/auths_controller'
import ParticipationsController from '#controllers/participations_controller'
import UsersController from '#controllers/users_controller'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/evenements', [EvenementsController, 'index']).prefix('/api')
router.get('/evenements/:id', [EvenementsController, 'show']).prefix('/api')

router.post('/register', [AuthController, 'register']).prefix('/api')
router.post('/login', [AuthController, 'login']).prefix('/api')

router
  .group(() => {

    router.post('/logout', [AuthController, 'logout'])

    router.get('/users', [UsersController, 'index'])

    router.get('/participations', [ParticipationsController, 'index'])
    router.post('/participations', [ParticipationsController, 'store'])

    router.post('/evenements', [EvenementsController, 'store'])
    router.put('/evenements/:id', [EvenementsController, 'update'])
    router.delete('/evenements/:id', [EvenementsController, 'destroy'])
  })
  .prefix('/api')
  .use(middleware.auth())