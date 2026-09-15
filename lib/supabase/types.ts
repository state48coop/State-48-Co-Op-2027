export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type AttributeGroup = {
  id: string;
  name: string;
  values: string[];
  sort_order: number;
  created_at: string;
};

export type ProductAttribute = {
  id: string;
  product_id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  product_id: string;
  combination: Json;
  price_modifier: number;
  stock: number;
  variant_image: string | null;
  sku: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  base_price: number;
  sku: string;
  images: string[];
  category: string;
  collection: string;
  product_type: string;
  allow_engrave: boolean;
  engrave_cost: number;
  is_published: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
};

type Table<Row, Insert = Row, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      admin_users: Table<{ user_id: string; created_at: string }, { user_id: string; created_at?: string }, { user_id?: string; created_at?: string }>;
      attribute_groups: Table<AttributeGroup, Omit<AttributeGroup, "id" | "created_at">, Partial<Omit<AttributeGroup, "id" | "created_at">>>;
      product_attributes: Table<ProductAttribute, Omit<ProductAttribute, "id">, Partial<Omit<ProductAttribute, "id">>>;
      product_variants: Table<ProductVariant, Omit<ProductVariant, "id">, Partial<Omit<ProductVariant, "id">>>;
      projects: Table<Record<string, unknown>>;
      products: Table<Product, Omit<Product, "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string }, Partial<Omit<Product, "id" | "created_at" | "updated_at">>>;
      events: Table<Record<string, unknown>>;
      ui_config: Table<Record<string, unknown>>;
      project_intakes: Table<Record<string, unknown>>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
