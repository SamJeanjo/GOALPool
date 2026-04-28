insert into public.tournaments (id, slug, name, sport, status, starts_at)
values (
  '11111111-1111-1111-1111-111111111111',
  'global-football-2026',
  'Global Football Tournament 2026',
  'football',
  'open',
  '2026-06-11 00:00:00+00'
)
on conflict (slug) do update set name = excluded.name, sport = excluded.sport, status = excluded.status;

with seed_teams (seed, name, country_code, flag_emoji, group_name) as (
  values
    (1, 'Argentina', 'AR', '🇦🇷', 'A'), (2, 'Japan', 'JP', '🇯🇵', 'A'),
    (3, 'France', 'FR', '🇫🇷', 'A'), (4, 'Morocco', 'MA', '🇲🇦', 'A'),
    (5, 'Brazil', 'BR', '🇧🇷', 'B'), (6, 'United States', 'US', '🇺🇸', 'B'),
    (7, 'England', 'GB-ENG', '🏴', 'B'), (8, 'South Korea', 'KR', '🇰🇷', 'B'),
    (9, 'Spain', 'ES', '🇪🇸', 'C'), (10, 'Ghana', 'GH', '🇬🇭', 'C'),
    (11, 'Netherlands', 'NL', '🇳🇱', 'C'), (12, 'Canada', 'CA', '🇨🇦', 'C'),
    (13, 'Portugal', 'PT', '🇵🇹', 'D'), (14, 'Egypt', 'EG', '🇪🇬', 'D'),
    (15, 'Germany', 'DE', '🇩🇪', 'D'), (16, 'Australia', 'AU', '🇦🇺', 'D'),
    (17, 'Italy', 'IT', '🇮🇹', 'E'), (18, 'Mexico', 'MX', '🇲🇽', 'E'),
    (19, 'Uruguay', 'UY', '🇺🇾', 'E'), (20, 'Senegal', 'SN', '🇸🇳', 'E'),
    (21, 'Belgium', 'BE', '🇧🇪', 'F'), (22, 'Switzerland', 'CH', '🇨🇭', 'F'),
    (23, 'Colombia', 'CO', '🇨🇴', 'F'), (24, 'Denmark', 'DK', '🇩🇰', 'F'),
    (25, 'Croatia', 'HR', '🇭🇷', 'G'), (26, 'Nigeria', 'NG', '🇳🇬', 'G'),
    (27, 'Sweden', 'SE', '🇸🇪', 'G'), (28, 'Ireland', 'IE', '🇮🇪', 'G'),
    (29, 'Norway', 'NO', '🇳🇴', 'H'), (30, 'Ivory Coast', 'CI', '🇨🇮', 'H'),
    (31, 'Chile', 'CL', '🇨🇱', 'H'), (32, 'Qatar', 'QA', '🇶🇦', 'H'),
    (33, 'Poland', 'PL', '🇵🇱', 'I'), (34, 'Cameroon', 'CM', '🇨🇲', 'I'),
    (35, 'Turkiye', 'TR', '🇹🇷', 'I'), (36, 'Paraguay', 'PY', '🇵🇾', 'I'),
    (37, 'Wales', 'GB-WLS', '🏴', 'J'), (38, 'Tunisia', 'TN', '🇹🇳', 'J'),
    (39, 'Ecuador', 'EC', '🇪🇨', 'J'), (40, 'South Africa', 'ZA', '🇿🇦', 'J'),
    (41, 'Ukraine', 'UA', '🇺🇦', 'K'), (42, 'Jamaica', 'JM', '🇯🇲', 'K'),
    (43, 'Austria', 'AT', '🇦🇹', 'K'), (44, 'Peru', 'PE', '🇵🇪', 'K'),
    (45, 'Scotland', 'GB-SCT', '🏴', 'L'), (46, 'New Zealand', 'NZ', '🇳🇿', 'L'),
    (47, 'Greece', 'GR', '🇬🇷', 'L'), (48, 'Costa Rica', 'CR', '🇨🇷', 'L')
)
insert into public.teams (tournament_id, name, country_code, flag_emoji, seed, group_name)
select '11111111-1111-1111-1111-111111111111', name, country_code, flag_emoji, seed, group_name
from seed_teams
on conflict do nothing;

with rules (round, points) as (
  values
    ('Round of 32', 1),
    ('Round of 16', 2),
    ('Quarterfinal', 4),
    ('Semifinal', 8),
    ('Final', 16),
    ('Champion', 32)
)
insert into public.scoring_rules (tournament_id, round, points)
select '11111111-1111-1111-1111-111111111111', round, points
from rules
on conflict (tournament_id, round) do update set points = excluded.points;

with knockout(round, position, seed_a, seed_b) as (
  values
    ('Round of 32', 0, 1, 2), ('Round of 32', 1, 3, 4),
    ('Round of 32', 2, 5, 6), ('Round of 32', 3, 7, 8),
    ('Round of 32', 4, 9, 10), ('Round of 32', 5, 11, 12),
    ('Round of 32', 6, 13, 14), ('Round of 32', 7, 15, 16),
    ('Round of 32', 8, 17, 18), ('Round of 32', 9, 19, 20),
    ('Round of 32', 10, 21, 22), ('Round of 32', 11, 23, 24),
    ('Round of 32', 12, 25, 26), ('Round of 32', 13, 27, 28),
    ('Round of 32', 14, 29, 30), ('Round of 32', 15, 31, 32),
    ('Round of 16', 0, null, null), ('Round of 16', 1, null, null),
    ('Round of 16', 2, null, null), ('Round of 16', 3, null, null),
    ('Round of 16', 4, null, null), ('Round of 16', 5, null, null),
    ('Round of 16', 6, null, null), ('Round of 16', 7, null, null),
    ('Quarterfinal', 0, null, null), ('Quarterfinal', 1, null, null),
    ('Quarterfinal', 2, null, null), ('Quarterfinal', 3, null, null),
    ('Semifinal', 0, null, null), ('Semifinal', 1, null, null),
    ('Final', 0, null, null)
)
insert into public.matches (tournament_id, round, position, team_a_id, team_b_id, status)
select
  '11111111-1111-1111-1111-111111111111',
  knockout.round,
  knockout.position,
  team_a.id,
  team_b.id,
  'open'
from knockout
left join public.teams team_a
  on team_a.tournament_id = '11111111-1111-1111-1111-111111111111'
  and team_a.seed = knockout.seed_a
left join public.teams team_b
  on team_b.tournament_id = '11111111-1111-1111-1111-111111111111'
  and team_b.seed = knockout.seed_b
where not exists (
  select 1 from public.matches existing
  where existing.tournament_id = '11111111-1111-1111-1111-111111111111'
  and existing.round = knockout.round
  and existing.position = knockout.position
);
