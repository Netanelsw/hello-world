-- TrustMap Seed Data
-- Note: In production, users are created via auth.users trigger.
-- This seed data is for development/testing with Supabase local.

-- Demo profiles (you'd need corresponding auth.users entries in local dev)
-- These are provided as reference for the structure.

-- INSERT INTO public.profiles (id, name, username, avatar_url, bio) VALUES
-- ('11111111-1111-1111-1111-111111111111', 'Shira Cohen', 'shira', null, 'Food lover & cafe hopper in Tel Aviv'),
-- ('22222222-2222-2222-2222-222222222222', 'Dan Levy', 'dan', null, 'Always looking for the best spots'),
-- ('33333333-3333-3333-3333-333333333333', 'Maya Bar', 'maya', null, 'Exploring one neighborhood at a time'),
-- ('44444444-4444-4444-4444-444444444444', 'Avi Stern', 'avi', null, 'Tech & coffee enthusiast');

-- Demo recommendations
-- INSERT INTO public.recommendations (user_id, place_id, place_name, comment, category) VALUES
-- ('11111111-1111-1111-1111-111111111111', 'ChIJN1t_tDeuEmsRUsoyG83frY4', 'Cafe Romano', 'Best brunch in Tel Aviv!', 'cafe'),
-- ('22222222-2222-2222-2222-222222222222', 'ChIJrTLr-GyuEmsRBfy61i59si0', 'Dr. Sarah Cohen', 'Been going here for years.', 'doctor'),
-- ('33333333-3333-3333-3333-333333333333', 'ChIJbWWHSCGuEmsRc2g_bVCEJOA', 'The Corner Falafel', 'Best falafel in the city.', 'restaurant'),
-- ('44444444-4444-4444-4444-444444444444', 'ChIJIQBpAG2ahYAR_6128GcTUEo', 'Nahat Coffee Roasters', 'Best specialty coffee.', 'cafe');
