CREATE TYPE "public"."offer_benefit_type" AS ENUM('fixedAmount', 'percentage', 'freeShipping', 'fixedPrice');--> statement-breakpoint
CREATE TYPE "public"."offer_condition_type" AS ENUM('basketItems', 'basketValue', 'distinctBasketItems');--> statement-breakpoint
CREATE TYPE "public"."offer_type" AS ENUM('site', 'voucher', 'user');--> statement-breakpoint
CREATE TABLE "offer_application_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"offerId" integer,
	"userId" text,
	"orderId" integer,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "offer_benefit" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"isActive" boolean DEFAULT true,
	"type" "offer_benefit_type" NOT NULL,
	"value" numeric NOT NULL,
	"maxAffectedItems" integer,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "offer_condition" (
	"id" serial PRIMARY KEY NOT NULL,
	"rangeId" integer,
	"type" "offer_condition_type" NOT NULL,
	"value" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offer_range_excluded_products" (
	"offerRangeId" integer NOT NULL,
	"productId" integer NOT NULL,
	CONSTRAINT "offer_range_excluded_products_offerRangeId_productId_pk" PRIMARY KEY("offerRangeId","productId")
);
--> statement-breakpoint
CREATE TABLE "offer_range_included_product_brands" (
	"offerRangeId" integer NOT NULL,
	"brandId" integer NOT NULL,
	CONSTRAINT "offer_range_included_product_brands_offerRangeId_brandId_pk" PRIMARY KEY("offerRangeId","brandId")
);
--> statement-breakpoint
CREATE TABLE "offer_range_included_product_categories" (
	"offerRangeId" integer NOT NULL,
	"categoryId" integer NOT NULL,
	CONSTRAINT "offer_range_included_product_categories_offerRangeId_categoryId_pk" PRIMARY KEY("offerRangeId","categoryId")
);
--> statement-breakpoint
CREATE TABLE "offer_range_included_product_classes" (
	"offerRangeId" integer NOT NULL,
	"productClassId" integer NOT NULL,
	CONSTRAINT "offer_range_included_product_classes_offerRangeId_productClassId_pk" PRIMARY KEY("offerRangeId","productClassId")
);
--> statement-breakpoint
CREATE TABLE "offer_range_included_products" (
	"offerRangeId" integer NOT NULL,
	"productId" integer NOT NULL,
	CONSTRAINT "offer_range_included_products_offerRangeId_productId_pk" PRIMARY KEY("offerRangeId","productId")
);
--> statement-breakpoint
CREATE TABLE "offer_range" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"isActive" boolean DEFAULT true,
	"includeAllProducts" boolean DEFAULT false,
	"shouldMatchAll" boolean DEFAULT false,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "offer" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"image" text,
	"type" "offer_type" NOT NULL,
	"voucherCode" text,
	"conditionId" integer,
	"benefitId" integer,
	"startDate" timestamp with time zone,
	"endDate" timestamp with time zone,
	"isActive" boolean DEFAULT true,
	"isFeatured" boolean DEFAULT false,
	"priority" integer DEFAULT 0,
	"limitPerUser" integer,
	"limitTotalUses" integer,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "offer_application_log" ADD CONSTRAINT "offer_application_log_offerId_offer_id_fk" FOREIGN KEY ("offerId") REFERENCES "public"."offer"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_condition" ADD CONSTRAINT "offer_condition_rangeId_offer_range_id_fk" FOREIGN KEY ("rangeId") REFERENCES "public"."offer_range"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_range_excluded_products" ADD CONSTRAINT "offer_range_excluded_products_offerRangeId_offer_range_id_fk" FOREIGN KEY ("offerRangeId") REFERENCES "public"."offer_range"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_range_excluded_products" ADD CONSTRAINT "offer_range_excluded_products_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_range_included_product_brands" ADD CONSTRAINT "offer_range_included_product_brands_offerRangeId_offer_range_id_fk" FOREIGN KEY ("offerRangeId") REFERENCES "public"."offer_range"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_range_included_product_brands" ADD CONSTRAINT "offer_range_included_product_brands_brandId_brand_id_fk" FOREIGN KEY ("brandId") REFERENCES "public"."brand"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_range_included_product_categories" ADD CONSTRAINT "offer_range_included_product_categories_offerRangeId_offer_range_id_fk" FOREIGN KEY ("offerRangeId") REFERENCES "public"."offer_range"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_range_included_product_categories" ADD CONSTRAINT "offer_range_included_product_categories_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_range_included_product_classes" ADD CONSTRAINT "offer_range_included_product_classes_offerRangeId_offer_range_id_fk" FOREIGN KEY ("offerRangeId") REFERENCES "public"."offer_range"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_range_included_product_classes" ADD CONSTRAINT "offer_range_included_product_classes_productClassId_product_class_id_fk" FOREIGN KEY ("productClassId") REFERENCES "public"."product_class"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_range_included_products" ADD CONSTRAINT "offer_range_included_products_offerRangeId_offer_range_id_fk" FOREIGN KEY ("offerRangeId") REFERENCES "public"."offer_range"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_range_included_products" ADD CONSTRAINT "offer_range_included_products_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer" ADD CONSTRAINT "offer_conditionId_offer_condition_id_fk" FOREIGN KEY ("conditionId") REFERENCES "public"."offer_condition"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer" ADD CONSTRAINT "offer_benefitId_offer_benefit_id_fk" FOREIGN KEY ("benefitId") REFERENCES "public"."offer_benefit"("id") ON DELETE no action ON UPDATE no action;