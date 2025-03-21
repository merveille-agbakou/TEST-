import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import { v4 as uuidv4 } from 'uuid'
import User from './user.js'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Evenement extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare code: string

  @column()
  declare title: string

  @column()
  declare place: number

  @column()
  declare description: string

  @column.date()
  declare startDate: DateTime

  @column.date()
  declare endDate: DateTime

  @column()
  declare status: 'actif' | 'expire'

  @column()
  declare is_deleted: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => User, {
    pivotTable: 'user_evenement',
    pivotForeignKey: 'evenement_id',
    pivotRelatedForeignKey: 'user_id',
  })
  declare users: ManyToMany<typeof User>

  @belongsTo(() => User, {
      foreignKey: 'user_id',
    })
    declare creator: BelongsTo<typeof User>

  // Hook pour générer un UUID avant la création
  @beforeCreate()
  public static async generateUuid(evenement: Evenement) {
    evenement.code = uuidv4()
  }
}