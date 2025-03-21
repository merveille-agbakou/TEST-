import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'evenements'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('isDeleted', 'is_deleted')

    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('is_deleted', 'isDeleted')
    })
  }
}