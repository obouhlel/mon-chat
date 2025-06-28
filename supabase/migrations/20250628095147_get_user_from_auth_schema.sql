create or replace view public.user_profiles as
select
  id,
  email,
  raw_user_meta_data->>'display_name' as display_name
from auth.users;