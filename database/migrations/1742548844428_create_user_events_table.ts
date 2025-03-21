import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_evenement'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('evenement_id').unsigned().references('id').inTable('evenements').onDelete('CASCADE')

      table.unique(['user_id', 'evenement_id']) // Pour éviter les doublons
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}