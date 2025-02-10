import { and, eq, ilike, or, SQL } from 'drizzle-orm'
import {
  NewOffer,
  NewOfferBenefit,
  NewOfferCondition,
  offerApplicationLogs,
  offerBenefits,
  offerConditions,
  offerRangeExcludedProducts,
  offerRangeIncludedProductBrands,
  offerRangeIncludedProductCategories,
  offerRangeIncludedProductClasses,
  offerRangeIncludedProducts,
  offerRanges,
  offers,
  UpdateOfferBenefit,
  UpdateOfferApplicationLog,
  UpdateOffer,
  UpdateOfferCondition,
  UpdateOfferRange,
  NewOfferApplicationLog,
  NewOfferRange,
} from '../schemas'

type PaginationArgs = {
  page: number
  size: number
}

interface OfferFilter {
  q?: string
  isActive?: boolean
  pagination?: PaginationArgs
}

class OfferService {
  private db: any

  constructor(dbInstance: any) {
    this.db = dbInstance
  }

  async create(offer: NewOffer) {
    const result = await this.db.insert(offers).values(offer).returning()
    return result[0]
  }

  async get(offerId: number) {
    const result = await this.db
      .select()
      .from(offers)
      .where(eq(offers.id, offerId))
    return result[0]
  }

  async update(offerId: number, offer: UpdateOffer) {
    const result = await this.db
      .update(offers)
      .set({
        ...offer,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(offers.id, offerId))
      .returning()
    return result[0]
  }

  async delete(offerId: number) {
    const result = await this.db
      .delete(offers)
      .where(eq(offers.id, offerId))
      .returning()
    return result[0]
  }

  async list(filter: OfferFilter) {
    const where: SQL[] = []

    if (filter.q) {
      where.push(
        or(
          Number(filter.q) ? eq(offers.id, Number(filter.q)) : undefined,
          ilike(offers.name, `%${filter.q}%`),
        )!,
      )
    }

    if (filter.isActive !== undefined) {
      where.push(eq(offers.isActive, filter.isActive))
    }

    const query = this.db
      .select()
      .from(offers)
      .where(and(...where))

    if (!filter.pagination) {
      return await query
    }

    const { page, size } = filter.pagination
    const results = await query.limit(size).offset((page - 1) * size)
    const total = await this.db.$count(offers, and(...where))
    return {
      results: results,
      pagination: {
        page,
        size,
        total,
        pages: Math.ceil(total / size),
      },
    }
  }

  async markAsActive(offerId: number) {
    const result = await this.db
      .update(offers)
      .set({ isActive: true })
      .where(eq(offers.id, offerId))
      .returning()
    return result[0]
  }

  async markAsInactive(offerId: number) {
    const result = await this.db
      .update(offers)
      .set({ isActive: false })
      .where(eq(offers.id, offerId))
      .returning()
    return result[0]
  }
}

interface OfferRangeFilter {
  q?: string
  isActive?: boolean
  pagination?: PaginationArgs
}

class OfferRangeService {
  private db: any

  constructor(dbInstance: any) {
    this.db = dbInstance
  }

  async list(filter: OfferRangeFilter) {
    const where: SQL[] = []

    if (filter.q) {
      where.push(
        or(
          Number(filter.q) ? eq(offers.id, Number(filter.q)) : undefined,
          ilike(offerRanges.name, `%${filter.q}%`),
        )!,
      )
    }

    if (filter.isActive !== undefined) {
      where.push(eq(offerRanges.isActive, filter.isActive))
    }

    const query = this.db
      .select()
      .from(offerRanges)
      .where(and(...where))

    if (!filter.pagination) {
      return await query
    }

    const { page, size } = filter.pagination
    const results = await query.limit(size).offset((page - 1) * size)
    const total = await this.db.$count(offerRanges, and(...where))
    return {
      results: results,
      pagination: {
        page,
        size,
        total,
        pages: Math.ceil(total / size),
      },
    }
  }

  async create(offerRange: NewOfferRange) {
    const result = await this.db
      .insert(offerRanges)
      .values(offerRange)
      .returning()
    if (offerRange.includedProducts) {
      await this.setIncludedProducts(result[0].id, offerRange.includedProducts)
    }
    if (offerRange.excludedProducts) {
      await this.setExcludedProducts(result[0].id, offerRange.excludedProducts)
    }
    if (offerRange.includedProductCategories) {
      await this.setIncludedProductCategories(
        result[0].id,
        offerRange.includedProductCategories,
      )
    }
    if (offerRange.includedProductBrands) {
      await this.setIncludedProductBrands(
        result[0].id,
        offerRange.includedProductBrands,
      )
    }
    if (offerRange.includedProductClasses) {
      await this.setIncludedProductClasses(
        result[0].id,
        offerRange.includedProductClasses,
      )
    }
    return result[0]
  }

  async get(offerRangeId: number) {
    const result = await this.db
      .select()
      .from(offerRanges)
      .where(eq(offerRanges.id, offerRangeId))
    return result[0]
  }

  async update(offerRangeId: number, offerRange: UpdateOfferRange) {
    const result = await this.db
      .update(offerRanges)
      .set({
        ...offerRange,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(offerRanges.id, offerRangeId))
      .returning()

    if (offerRange.includedProducts) {
      await this.setIncludedProducts(offerRangeId, offerRange.includedProducts)
    }

    if (offerRange.excludedProducts) {
      await this.setExcludedProducts(offerRangeId, offerRange.excludedProducts)
    }

    if (offerRange.includedProductCategories) {
      await this.setIncludedProductCategories(
        offerRangeId,
        offerRange.includedProductCategories,
      )
    }

    if (offerRange.includedProductBrands) {
      await this.setIncludedProductBrands(
        offerRangeId,
        offerRange.includedProductBrands,
      )
    }

    if (offerRange.includedProductClasses) {
      await this.setIncludedProductClasses(
        offerRangeId,
        offerRange.includedProductClasses,
      )
    }
    return result[0]
  }

  async delete(offerRangeId: number) {
    const result = await this.db
      .delete(offerRanges)
      .where(eq(offerRanges.id, offerRangeId))
      .returning()
    return result[0]
  }

  async markAsActive(offerRangeId: number) {
    const result = await this.db
      .update(offerRanges)
      .set({ isActive: true })
      .where(eq(offerRanges.id, offerRangeId))
      .returning()
    return result[0]
  }

  async markAsInactive(offerRangeId: number) {
    const result = await this.db
      .update(offerRanges)
      .set({ isActive: false })
      .where(eq(offerRanges.id, offerRangeId))
      .returning()
    return result[0]
  }

  async setIncludedProducts(offerRangeId: number, productIds: number[]) {
    await this.db
      .delete(offerRangeIncludedProducts)
      .where(eq(offerRangeIncludedProducts.offerRangeId, offerRangeId))
    if (!productIds.length) {
      await this.db
        .insert(offerRangeIncludedProducts)
        .values(productIds.map((productId) => ({ offerRangeId, productId })))
    }
  }

  async setExcludedProducts(offerRangeId: number, productIds: number[]) {
    await this.db
      .delete(offerRangeExcludedProducts)
      .where(eq(offerRangeExcludedProducts.offerRangeId, offerRangeId))
    if (!productIds.length) {
      await this.db
        .insert(offerRangeExcludedProducts)
        .values(productIds.map((productId) => ({ offerRangeId, productId })))
    }
  }

  async setIncludedProductCategories(
    offerRangeId: number,
    categoryIds: number[],
  ) {
    await this.db
      .delete(offerRangeIncludedProductCategories)
      .where(eq(offerRangeIncludedProductCategories.offerRangeId, offerRangeId))
    if (!categoryIds.length) {
      await this.db
        .insert(offerRangeIncludedProductCategories)
        .values(categoryIds.map((categoryId) => ({ offerRangeId, categoryId })))
    }
  }

  async setIncludedProductBrands(offerRangeId: number, brandIds: number[]) {
    await this.db
      .delete(offerRangeIncludedProductBrands)
      .where(eq(offerRangeIncludedProductBrands.offerRangeId, offerRangeId))
    if (!brandIds.length) {
      await this.db
        .insert(offerRangeIncludedProductBrands)
        .values(brandIds.map((brandId) => ({ offerRangeId, brandId })))
    }
  }

  async setIncludedProductClasses(offerRangeId: number, classIds: number[]) {
    await this.db
      .delete(offerRangeIncludedProductClasses)
      .where(eq(offerRangeIncludedProductClasses.offerRangeId, offerRangeId))
    if (!classIds.length) {
      await this.db
        .insert(offerRangeIncludedProductClasses)
        .values(classIds.map((classId) => ({ offerRangeId, classId })))
    }
  }
}

interface OfferConditionFilter {
  pagination?: PaginationArgs
}

class OfferConditionService {
  private db: any

  constructor(dbInstance: any) {
    this.db = dbInstance
  }

  async list(filter: OfferConditionFilter) {
    const where: SQL[] = []

    const query = this.db
      .select()
      .from(offerConditions)
      .where(and(...where))

    if (!filter.pagination) {
      return await query
    }

    const { page, size } = filter.pagination
    const results = await query.limit(size).offset((page - 1) * size)
    const total = await this.db.$count(offerConditions, and(...where))
    return {
      results: results,
      pagination: {
        page,
        size,
        total,
        pages: Math.ceil(total / size),
      },
    }
  }

  async create(offerCondition: NewOfferCondition) {
    const result = await this.db
      .insert(offerConditions)
      .values(offerCondition)
      .returning()
    return result[0]
  }

  async get(offerConditionId: number) {
    const result = await this.db
      .select()
      .from(offerConditions)
      .where(eq(offerConditions.id, offerConditionId))
    return result[0]
  }

  async update(offerConditionId: number, offerCondition: UpdateOfferCondition) {
    const result = await this.db
      .update(offerConditions)
      .set({
        ...offerCondition,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(offerConditions.id, offerConditionId))
      .returning()
    return result[0]
  }

  async delete(offerConditionId: number) {
    const result = await this.db
      .delete(offerConditions)
      .where(eq(offerConditions.id, offerConditionId))
      .returning()
    return result[0]
  }
}

interface OfferBenefitFilter {
  q?: string
  isActive?: boolean
  pagination?: PaginationArgs
}

class OfferBenefitService {
  private db: any

  constructor(dbInstance: any) {
    this.db = dbInstance
  }

  async list(filter: OfferBenefitFilter) {
    const where: SQL[] = []

    if (filter.q) {
      where.push(
        or(
          Number(filter.q) ? eq(offerBenefits.id, Number(filter.q)) : undefined,
          ilike(offerBenefits.name, `%${filter.q}%`),
        )!,
      )
    }

    if (filter.isActive !== undefined) {
      where.push(eq(offerBenefits.isActive, filter.isActive))
    }

    const query = this.db
      .select()
      .from(offerBenefits)
      .where(and(...where))

    if (!filter.pagination) {
      return await query
    }

    const { page, size } = filter.pagination

    const results = await query.limit(size).offset((page - 1) * size)

    const total = await this.db.$count(offerBenefits, and(...where))

    return {
      results: results,
      pagination: {
        page,
        size,
        total,
        pages: Math.ceil(total / size),
      },
    }
  }

  async create(offerBenefit: NewOfferBenefit) {
    const result = await this.db
      .insert(offerBenefits)
      .values(offerBenefit)
      .returning()
    return result[0]
  }

  async get(offerBenefitId: number) {
    const result = await this.db
      .select()
      .from(offerBenefits)
      .where(eq(offerBenefits.id, offerBenefitId))
    return result[0]
  }

  async update(offerBenefitId: number, offerBenefit: UpdateOfferBenefit) {
    const result = await this.db
      .update(offerBenefits)
      .set({
        ...offerBenefit,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(offerBenefits.id, offerBenefitId))
      .returning()
    return result[0]
  }

  async delete(offerBenefitId: number) {
    const result = await this.db
      .delete(offerBenefits)
      .where(eq(offerBenefits.id, offerBenefitId))
      .returning()
    return result[0]
  }
}

interface OfferApplicationLogFilter {
  pagination?: PaginationArgs
}

class OfferApplicationLogService {
  private db: any

  constructor(dbInstance: any) {
    this.db = dbInstance
  }

  async list(filter: OfferApplicationLogFilter) {
    const where: SQL[] = []

    const query = this.db
      .select()
      .from(offerApplicationLogs)
      .where(and(...where))

    if (!filter.pagination) {
      return await query
    }

    const { page, size } = filter.pagination
    const results = await query.limit(size).offset((page - 1) * size)
    const total = await this.db.$count(offerApplicationLogs, and(...where))
    return {
      results: results,
      pagination: {
        page,
        size,
        total,
        pages: Math.ceil(total / size),
      },
    }
  }

  async create(offerApplicationLog: NewOfferApplicationLog) {
    const result = await this.db
      .insert(offerApplicationLogs)
      .values(offerApplicationLog)
      .returning()
    return result[0]
  }

  async get(offerApplicationLogId: number) {
    const result = await this.db
      .select()
      .from(offerApplicationLogs)
      .where(eq(offerApplicationLogs.id, offerApplicationLogId))
    return result[0]
  }

  async update(
    offerApplicationLogId: number,
    offerApplicationLog: UpdateOfferApplicationLog,
  ) {
    const result = await this.db
      .update(offerApplicationLogs)
      .set({
        ...offerApplicationLog,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(offerApplicationLogs.id, offerApplicationLogId))
      .returning()
    return result[0]
  }

  async delete(offerApplicationLogId: number) {
    const result = await this.db
      .delete(offerApplicationLogs)
      .where(eq(offerApplicationLogs.id, offerApplicationLogId))
      .returning()
    return result[0]
  }
}

export {
  OfferService,
  OfferRangeService,
  OfferConditionService,
  OfferBenefitService,
  OfferApplicationLogService,
}
