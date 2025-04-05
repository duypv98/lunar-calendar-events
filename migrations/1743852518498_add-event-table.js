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
  pgm.createTable("events", {
    id: "id",
    title: { type: "text", notNull: true },
    description: { type: "text", notNull: false },
    location: { type: "text", notNull: false },
    start_time: { type: "bigint", notNull: false }, // For the event that happens on a specific date
    end_time: { type: "bigint", notNull: false }, // For the event that happens on a specific date
    start_time_str: { type: "varchar(126)", notNull: false }, // For the event that happens on a specific date or a recurring event
    end_time_str: { type: "varchar(126)", notNull: false }, // For the event that happens on a specific date or a recurring event
    recurring_type: { type: "integer", notNull: false }, // 0 = none, 1 = daily, 2 = weekly, 3 = monthly, 4 = yearly
    recurring_dow: { type: "integer", notNull: false }, // 0 = sunday, 1 = monday, 2 = tuesday, 3 = wednesday, 4 = thursday, 5 = friday, 6 = saturday
    recurring_date: { type: "integer", notNull: false }, // day of the month
    recurring_month: { type: "integer", notNull: false }, // month of the year
    deleted_at: { type: "bigint", notNull: false }
  })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("events");
};
