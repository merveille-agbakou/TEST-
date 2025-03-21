import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_evenement'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamps(true, true)

    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      
    })
  }
}