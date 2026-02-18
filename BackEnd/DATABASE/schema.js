import {
  pgTable,
  serial,
  text,
  timestamp,
  pgEnum,
  uuid,
  PgUUID,
  varchar,
} from "drizzle-orm/pg-core";

//---Enums---
export const roleEnum = pgEnum("role", ["ADMIN", "BUYER", "SOLVER", "USER"]);
export const projectStatusEnum = pgEnum("project_status", [
  "OPEN",
  "ASSIGNED",
  "COMPLETED",
  "CANCEL",
]);
export const requestStatusEnum = pgEnum("request_status", [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
]);
export const taskStatusEnum = pgEnum("task_status", [
  "TODO",
  "SUBMITTED",
  "COMPLETED",
]);

// ---Users Table---
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  email: varchar("email", { length: 50 }).unique().notNull(),
  password: text("password").notNull(),
  role: roleEnum("role").default("USER"),
  createdAt: timestamp("created_at").defaultNow(),
});

// --- Projects Table ---
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description").notNull(),
  status: projectStatusEnum("status").default("OPEN"),
  buyerId: uuid("buyer_id").references(() => users.id),
  solverId: uuid("solver_id").references(() => users.id), // Nullable because it starts unassigned
  createdAt: timestamp("created_at").defaultNow(),
});

// --- Tasks Table ---
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  projectId: serial("project_id").references(() => projects.id),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description"),
  deadline: timestamp("deadline"),
  status: taskStatusEnum("status").default("TODO"),
  createdAt: timestamp("created_at").defaultNow(),
  zipFileUrl: text("zip_file_url"),
});

export const requests = pgTable("request", {
  id: serial("id").primaryKey(),
  projectId: serial("project_id").references(() => projects.id),
  solverId: uuid("solver_id")
    .references(() => users.id)
    .notNull(),
  status: requestStatusEnum("status").default("PENDING"),
});
