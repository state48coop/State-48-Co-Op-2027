# State 48 Co-Op

Fresh Next.js 14 / Supabase foundation for the State 48 Co-Op website.

## Admin setup

Run the migrations in `supabase/migrations` in order. The first two create the base schema and policies; `0003_admin_product_workflow.sql` adds product collections, archive state, updated timestamps, and the public `product-images` Storage bucket; `0004_project_intakes.sql` adds the intake inbox table.

Once the first Auth user exists, add that user’s UUID to `public.admin_users` before opening `/dashboard`.
