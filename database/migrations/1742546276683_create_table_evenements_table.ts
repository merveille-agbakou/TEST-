import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'evenements'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('code').unique().notNullable()
      table.string('title').notNullable()
      table.integer('place').notNullable()
      table.text('description').notNullable()
      table.date('start_date').notNullable()
      table.date('end_date').notNullable()
      table.enu('status', ['actif', 'expire']).notNullable()
      table.boolean('isDeleted').notNullable().defaultTo(false)

      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}