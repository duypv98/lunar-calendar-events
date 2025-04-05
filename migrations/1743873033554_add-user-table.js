/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("users", {
    id: "id",
    account: { type: "text", notNull: true },
    password: { type: "text", notNull: true },
    name: { type: "text", notNull: false }
  });

  pgm.addColumn("events", {
    user_id: {
      type: "integer",
      references: '"users"',
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
      notNull: false
    }
  })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropColumn("events", "user_id");
  pgm.dropTable("users");
};
