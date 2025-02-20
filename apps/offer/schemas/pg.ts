import { relations } from 'drizzle-orm'
import { orders } from '../../order/schemas'
import {
  brands,
  categories,
  productClasses,
  products,
} from '../../product/schemas'
import {
  pgEnum,
  timestamp,
  boolean,
  integer,
  text,
  pgTable,
  serial,
  primaryKey,
} from 'drizzle-orm/pg-core'

export const offerRanges = pgTable('offer_range', {
  id: serial().primaryKey(),
  name: text().notNull(),
  description: text(),
  isActive: boolean().default(true),
  includeAllProducts: boolean().default(false),
  inclusiveFilter: boolean().default(false),
  createdAt: timestamp({
    withTimezone: true,
    mode: 'string',
  }),
  updatedAt: timestamp({
    withTimezone: true,
    mode: 'string',
  }),
})

export const offerRangeIncludedProducts = pgTable(
  'offer_range_included_product',
  {
    rangeId: integer().references(() => offerRanges.id, {
      onDelete: 'cascade',
    }),
    productId: integer().references(() => products.id, {
      onDelete: 'cascade',
    }),
  },
  (t) => [
    primaryKey({
      columns: [t.rangeId, t.productId],
    }),
  ],
)

export const offerRangeExcludedProducts = pgTable(
  'offer_range_excluded_product',
  {
    rangeId: integer().references(() => offerRanges.id, {
      onDelete: 'cascade',
    }),
    productId: integer().references(() => products.id, {
      onDelete: 'cascade',
    }),
  },
  (t) => [
    primaryKey({
      columns: [t.rangeId, t.productId],
    }),
  ],
)

export const offerRangeIncludedCategories = pgTable(
  'offer_range_included_category',
  {
    rangeId: integer().references(() => offerRanges.id, {
      onDelete: 'cascade',
    }),
    categoryId: integer().references(() => categories.id, {
      onDelete: 'cascade',
    }),
  },
  (t) => [
    primaryKey({
      columns: [t.rangeId, t.categoryId],
    }),
  ],
)

export const offerRangeIncludedBrands = pgTable(
  'offer_range_included_brand',
  {
    rangeId: integer().references(() => offerRanges.id, {
      onDelete: 'cascade',
    }),
    brandId: integer().references(() => brands.id, {
      onDelete: 'cascade',
    }),
  },
  (t) => [
    primaryKey({
      columns: [t.rangeId, t.brandId],
    }),
  ],
)

export const offerRangeIncludedProductClasses = pgTable(
  'offer_range_included_product_class',
  {
    rangeId: integer().references(() => offerRanges.id, {
      onDelete: 'cascade',
    }),
    productClassId: integer().references(() => productClasses.id, {
      onDelete: 'cascade',
    }),
  },
  (t) => [
    primaryKey({
      columns: [t.rangeId, t.productClassId],
    }),
  ],
)

export const offerBenefitType = pgEnum('offer_benefit_type', [
  'fixed_amount',
  'percentage',
  'free_shipping',
  'fixed_price',
])

export const offerBenefits = pgTable('offer_benefit', {
  id: serial().primaryKey(),
  name: text().notNull(),
  description: text(),
  isActive: boolean().default(true),
  type: offerBenefitType().notNull(),
  value: integer().notNull(),
  maxAffectedItems: integer(),
  createdAt: timestamp({
    withTimezone: true,
    mode: 'string',
  }),
  updatedAt: timestamp({
    withTimezone: true,
    mode: 'string',
  }),
})

export const offerConditionType = pgEnum('offer_condition_type', [
  'basket_quantity',
  'basket_total',
  'distinct_items',
])

export const offerConditions = pgTable('offer_condition', {
  id: serial().primaryKey(),
  rangeId: integer().references(() => offerRanges.id).notNull(),
  type: offerConditionType().notNull(),
  value: integer().notNull(),
  createdAt: timestamp({
    withTimezone: true,
    mode: 'string',
  }),
  updatedAt: timestamp({
    withTimezone: true,
    mode: 'string',
  }),
})

export const offerType = pgEnum('offer_type', ['site', 'product', 'service'])

export const offers = pgTable('offer', {
  id: serial().primaryKey(),
  name: text().notNull(),
  description: text(),
  image: text(),
  type: offerType().notNull(),
  voucherCode: text(),
  conditionId: integer().references(() => offerConditions.id).notNull(),
  benefitId: integer().references(() => offerBenefits.id).notNull(),
  startDate: timestamp({
    withTimezone: true,
    mode: 'string',
  }),
  endDate: timestamp({
    withTimezone: true,
    mode: 'string',
  }),
  isActive: boolean().default(true),
  isFeatured: boolean().default(false),
  priority: integer().default(0),
  limitPerUser: integer(),
  overallLimit: integer(),
  createdAt: timestamp({
    withTimezone: true,
    mode: 'string',
  }),
  updatedAt: timestamp({
    withTimezone: true,
    mode: 'string',
  }),
})

export const offerApplicationLogs = pgTable('offer_application_log', {
  id: serial().primaryKey(),
  offerId: integer(),
  orderId: integer(),
  userId: text(),
  createdAt: timestamp({
    withTimezone: true,
    mode: 'string',
  }),
})

export const offerRangeRelations = relations(offerRanges, ({ many }) => ({
  includedProducts: many(offerRangeIncludedProducts),
  excludedProducts: many(offerRangeExcludedProducts),
  includedCategories: many(offerRangeIncludedCategories),
  includedBrands: many(offerRangeIncludedBrands),
  includedProductClasses: many(offerRangeIncludedProductClasses),
}))

export const offerBenefitRelations = relations(offerBenefits, ({ one }) => ({
  offers: one(offers, {
    fields: [offerBenefits.id],
    references: [offers.benefitId],
  }),
}))

export const offerConditionRelations = relations(
  offerConditions,
  ({ one }) => ({
    range: one(offerRanges, {
      fields: [offerConditions.rangeId],
      references: [offerRanges.id],
    }),
  }),
)

export const offerRelations = relations(offers, ({ one }) => ({
  condition: one(offerConditions, {
    fields: [offers.conditionId],
    references: [offerConditions.id],
  }),
  benefit: one(offerBenefits, {
    fields: [offers.benefitId],
    references: [offerBenefits.id],
  }),
}))

export const offerRangeIncludedProductRelations = relations(
  offerRangeIncludedProducts,
  ({ one }) => ({
    range: one(offerRanges, {
      fields: [offerRangeIncludedProducts.rangeId],
      references: [offerRanges.id],
    }),
    product: one(products, {
      fields: [offerRangeIncludedProducts.productId],
      references: [products.id],
    }),
  }),
)

export const offerRangeExcludedProductRelations = relations(
  offerRangeExcludedProducts,
  ({ one }) => ({
    range: one(offerRanges, {
      fields: [offerRangeExcludedProducts.rangeId],
      references: [offerRanges.id],
    }),
    product: one(products, {
      fields: [offerRangeExcludedProducts.productId],
      references: [products.id],
    }),
  }),
)

export const offerRangeIncludedCategoryRelations = relations(
  offerRangeIncludedCategories,
  ({ one }) => ({
    range: one(offerRanges, {
      fields: [offerRangeIncludedCategories.rangeId],
      references: [offerRanges.id],
    }),
    category: one(categories, {
      fields: [offerRangeIncludedCategories.categoryId],
      references: [categories.id],
    }),
  }),
)

export const offerRangeIncludedBrandRelations = relations(
  offerRangeIncludedBrands,
  ({ one }) => ({
    range: one(offerRanges, {
      fields: [offerRangeIncludedBrands.rangeId],
      references: [offerRanges.id],
    }),
    brand: one(brands, {
      fields: [offerRangeIncludedBrands.brandId],
      references: [brands.id],
    }),
  }),
)

export const offerRangeIncludedProductClassRelations = relations(
  offerRangeIncludedProductClasses,
  ({ one }) => ({
    range: one(offerRanges, {
      fields: [offerRangeIncludedProductClasses.rangeId],
      references: [offerRanges.id],
    }),
    productClass: one(productClasses, {
      fields: [offerRangeIncludedProductClasses.productClassId],
      references: [productClasses.id],
    }),
  }),
)

export const offerApplicationLogRelations = relations(
  offerApplicationLogs,
  ({ one }) => ({
    offer: one(offers, {
      fields: [offerApplicationLogs.offerId],
      references: [offers.id],
    }),
    order: one(orders, {
      fields: [offerApplicationLogs.orderId],
      references: [orders.id],
    }),
  }),
)

export type Offer = typeof offers.$inferSelect
export type NewOffer = Omit<
  typeof offers.$inferInsert,
  'id' | 'createdAt' | 'updatedAt'
>
export type UpdateOffer = Partial<NewOffer>

export type OfferRange = typeof offerRanges.$inferSelect
export type NewOfferRange = Omit<
  typeof offerRanges.$inferInsert,
  'id' | 'createdAt' | 'updatedAt'
> & {
  includedProducts?: number[]
  excludedProducts?: number[]
  includedCategories?: number[]
  includedBrands?: number[]
  includedProductClasses?: number[]
}
export type UpdateOfferRange = Partial<NewOfferRange>

export type OfferBenefit = typeof offerBenefits.$inferSelect
export type NewOfferBenefit = Omit<
  typeof offerBenefits.$inferInsert,
  'id' | 'createdAt' | 'updatedAt'
>
export type UpdateOfferBenefit = Partial<NewOfferBenefit>

export type OfferCondition = typeof offerConditions.$inferSelect
export type NewOfferCondition = Omit<
  typeof offerConditions.$inferInsert,
  'id' | 'createdAt' | 'updatedAt'
>
export type UpdateOfferCondition = Partial<NewOfferCondition>

export type OfferApplicationLog = typeof offerApplicationLogs.$inferSelect
export type NewOfferApplicationLog = Omit<
  typeof offerApplicationLogs.$inferInsert,
  'id' | 'createdAt'
>
export type UpdateOfferApplicationLog = Partial<NewOfferApplicationLog>
