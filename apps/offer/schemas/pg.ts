import {
  brands,
  categories,
  productClasses,
  products,
} from 'apps/product/schemas'
import { relations } from 'drizzle-orm'
import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const offerRanges = pgTable('offer_range', {
  id: serial().primaryKey(),
  name: text().notNull(),
  description: text(),
  isActive: boolean().default(true),
  includeAllProducts: boolean().default(false),
  shouldMatchAll: boolean().default(false),
  createdAt: timestamp({ mode: 'string', withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ mode: 'string', withTimezone: true }).defaultNow(),
})

export const offerRangeIncludedProducts = pgTable(
  'offer_range_included_products',
  {
    offerRangeId: integer()
      .notNull()
      .references(() => offerRanges.id, {
        onDelete: 'cascade',
      }),
    productId: integer()
      .notNull()
      .references(() => products.id),
  },
  (t) => [primaryKey({ columns: [t.offerRangeId, t.productId] })],
)

export const offerRangeExcludedProducts = pgTable(
  'offer_range_excluded_products',
  {
    offerRangeId: integer()
      .notNull()
      .references(() => offerRanges.id, {
        onDelete: 'cascade',
      }),
    productId: integer()
      .notNull()
      .references(() => products.id, {
        onDelete: 'cascade',
      }),
  },
  (t) => [primaryKey({ columns: [t.offerRangeId, t.productId] })],
)

export const offerRangeIncludedProductCategories = pgTable(
  'offer_range_included_product_categories',
  {
    offerRangeId: integer()
      .notNull()
      .references(() => offerRanges.id, {
        onDelete: 'cascade',
      }),
    categoryId: integer()
      .notNull()
      .references(() => categories.id, {
        onDelete: 'cascade',
      }),
  },
  (t) => [primaryKey({ columns: [t.offerRangeId, t.categoryId] })],
)

export const offerRangeIncludedProductBrands = pgTable(
  'offer_range_included_product_brands',
  {
    offerRangeId: integer()
      .notNull()
      .references(() => offerRanges.id, {
        onDelete: 'cascade',
      }),
    brandId: integer()
      .notNull()
      .references(() => brands.id, {
        onDelete: 'cascade',
      }),
  },
  (t) => [primaryKey({ columns: [t.offerRangeId, t.brandId] })],
)

export const offerRangeIncludedProductClasses = pgTable(
  'offer_range_included_product_classes',
  {
    offerRangeId: integer()
      .notNull()
      .references(() => offerRanges.id, {
        onDelete: 'cascade',
      }),
    productClassId: integer()
      .notNull()
      .references(() => productClasses.id, {
        onDelete: 'cascade',
      }),
  },
  (t) => [primaryKey({ columns: [t.offerRangeId, t.productClassId] })],
)

export const offerConditionTypes = pgEnum('offer_condition_type', [
  'basketItems',
  'basketValue',
  'distinctBasketItems',
])

export const offerConditions = pgTable('offer_condition', {
  id: serial().primaryKey(),
  rangeId: integer().references(() => offerRanges.id),
  type: offerConditionTypes().notNull(),
  value: numeric().notNull(),
})

export const offerBenefitTypes = pgEnum('offer_benefit_type', [
  'fixedAmount',
  'percentage',
  'freeShipping',
  'fixedPrice',
])

export const offerBenefits = pgTable('offer_benefit', {
  id: serial().primaryKey(),
  name: text().notNull(),
  description: text(),
  isActive: boolean().default(true),
  type: offerBenefitTypes().notNull(),
  value: numeric().notNull(),
  maxAffectedItems: integer(),
  createdAt: timestamp({ mode: 'string', withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ mode: 'string', withTimezone: true }).defaultNow(),
})

export const offerTypes = pgEnum('offer_type', ['site', 'voucher', 'user'])

export const offers = pgTable('offer', {
  id: serial().primaryKey(),
  name: text().notNull(),
  description: text(),
  image: text(),
  type: offerTypes().notNull(),
  voucherCode: text(),
  conditionId: integer().references(() => offerConditions.id),
  benefitId: integer().references(() => offerBenefits.id),
  startDate: timestamp({ mode: 'string', withTimezone: true }),
  endDate: timestamp({ mode: 'string', withTimezone: true }),
  isActive: boolean().default(true),
  isFeatured: boolean().default(false),
  priority: integer().default(0),
  limitPerUser: integer(),
  limitTotalUses: integer(),
  createdAt: timestamp({ mode: 'string', withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ mode: 'string', withTimezone: true }).defaultNow(),
})

export const offerApplicationLogs = pgTable('offer_application_log', {
  id: serial().primaryKey(),
  offerId: integer().references(() => offers.id),
  userId: text(),
  orderId: integer(),
  createdAt: timestamp({ mode: 'string', withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ mode: 'string', withTimezone: true }).defaultNow(),
})

export const offerRangeRelations = relations(offerRanges, ({ many, one }) => ({
  includedProducts: many(offerRangeIncludedProducts),
  excludedProducts: many(offerRangeExcludedProducts),
  includedProductCategories: many(offerRangeIncludedProductCategories),
  includedProductBrands: many(offerRangeIncludedProductBrands),
  includedProductClasses: many(offerRangeIncludedProductClasses),
}))

export const offerRangeIncludedProductRelations = relations(
  offerRangeIncludedProducts,
  ({ one }) => ({
    product: one(products),
    range: one(offerRanges),
  }),
)

export const offerRangeExcludedProductRelations = relations(
  offerRangeExcludedProducts,
  ({ one }) => ({
    product: one(products),
    range: one(offerRanges),
  }),
)

export const offerRangeIncludedProductCategoryRelations = relations(
  offerRangeIncludedProductCategories,
  ({ one }) => ({
    category: one(products),
    range: one(offerRanges),
  }),
)

export const offerRangeIncludedProductBrandRelations = relations(
  offerRangeIncludedProductBrands,
  ({ one }) => ({
    brand: one(products),
    range: one(offerRanges),
  }),
)

export const offerRangeIncludedProductClassRelations = relations(
  offerRangeIncludedProductClasses,
  ({ one }) => ({
    productClass: one(products),
    range: one(offerRanges),
  }),
)

export const offerConditionRelations = relations(
  offerConditions,
  ({ one }) => ({
    range: one(offerRanges),
  }),
)

export const offerRelations = relations(offers, ({ one }) => ({
  condition: one(offerConditions),
  benefit: one(offerBenefits),
}))

export const offerBenefitRelations = relations(offerBenefits, ({ one }) => ({
  offers: one(offers),
}))

export const offerApplicationLogRelations = relations(
  offerApplicationLogs,
  ({ one }) => ({
    offer: one(offers),
  }),
)

export type Offer = typeof offers.$inferSelect
export type NewOffer = Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateOffer = Partial<NewOffer>

export type OfferRange = typeof offerRanges.$inferSelect
export interface NewOfferRange
  extends Omit<OfferRange, 'id' | 'createdAt' | 'updatedAt'> {
  includedProducts?: number[]
  excludedProducts?: number[]
  includedProductCategories?: number[]
  includedProductBrands?: number[]
  includedProductClasses?: number[]
}
export type UpdateOfferRange = Partial<NewOfferRange>

export type OfferCondition = typeof offerConditions.$inferSelect
export type NewOfferCondition = Omit<OfferCondition, 'id'>
export type UpdateOfferCondition = Partial<NewOfferCondition>

export type OfferBenefit = typeof offerBenefits.$inferSelect
export type NewOfferBenefit = Omit<
  OfferBenefit,
  'id' | 'createdAt' | 'updatedAt'
>
export type UpdateOfferBenefit = Partial<NewOfferBenefit>

export type OfferApplicationLog = typeof offerApplicationLogs.$inferSelect
export type NewOfferApplicationLog = Omit<
  OfferApplicationLog,
  'id' | 'createdAt' | 'updatedAt'
>
export type UpdateOfferApplicationLog = Partial<NewOfferApplicationLog>
