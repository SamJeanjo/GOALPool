insert into public.tournaments (id, slug, name, sport, status, starts_at)
values (
  '11111111-1111-1111-1111-111111111111',
  'global-football-2026',
  '2026 Global Football Tournament',
  'football',
  'open',
  '2026-06-11 00:00:00+00'
)
on conflict (slug) do update set name = excluded.name, sport = excluded.sport, status = excluded.status;

with seed_teams (seed, name, country_code, flag_emoji, group_name) as (
  values
    (1, 'Canada', 'CA', '🇨🇦', 'A'), (2, 'Mexico', 'MX', '🇲🇽', 'A'),
    (3, 'United States', 'US', '🇺🇸', 'A'), (4, 'Argentina', 'AR', '🇦🇷', 'A'),
    (5, 'Brazil', 'BR', '🇧🇷', 'B'), (6, 'Uruguay', 'UY', '🇺🇾', 'B'),
    (7, 'Colombia', 'CO', '🇨🇴', 'B'), (8, 'Ecuador', 'EC', '🇪🇨', 'B'),
    (9, 'Paraguay', 'PY', '🇵🇾', 'C'), (10, 'Japan', 'JP', '🇯🇵', 'C'),
    (11, 'South Korea', 'KR', '🇰🇷', 'C'), (12, 'Iran', 'IR', '🇮🇷', 'C'),
    (13, 'Australia', 'AU', '🇦🇺', 'D'), (14, 'Uzbekistan', 'UZ', '🇺🇿', 'D'),
    (15, 'Jordan', 'JO', '🇯🇴', 'D'), (16, 'Saudi Arabia', 'SA', '🇸🇦', 'D'),
    (17, 'Qatar', 'QA', '🇶🇦', 'E'), (18, 'Morocco', 'MA', '🇲🇦', 'E'),
    (19, 'Tunisia', 'TN', '🇹🇳', 'E'), (20, 'Egypt', 'EG', '🇪🇬', 'E'),
    (21, 'Algeria', 'DZ', '🇩🇿', 'F'), (22, 'Ghana', 'GH', '🇬🇭', 'F'),
    (23, 'Cape Verde', 'CV', '🇨🇻', 'F'), (24, 'New Zealand', 'NZ', '🇳🇿', 'F'),
    (25, 'Qualifier 1', 'Q1', '◆', 'G'), (26, 'Qualifier 2', 'Q2', '◆', 'G'),
    (27, 'Qualifier 3', 'Q3', '◆', 'G'), (28, 'Qualifier 4', 'Q4', '◆', 'G'),
    (29, 'Qualifier 5', 'Q5', '◆', 'H'), (30, 'Qualifier 6', 'Q6', '◆', 'H'),
    (31, 'Qualifier 7', 'Q7', '◆', 'H'), (32, 'Qualifier 8', 'Q8', '◆', 'H'),
    (33, 'Qualifier 9', 'Q9', '◆', 'I'), (34, 'Qualifier 10', 'Q10', '◆', 'I'),
    (35, 'Qualifier 11', 'Q11', '◆', 'I'), (36, 'Qualifier 12', 'Q12', '◆', 'I'),
    (37, 'Qualifier 13', 'Q13', '◆', 'J'), (38, 'Qualifier 14', 'Q14', '◆', 'J'),
    (39, 'Qualifier 15', 'Q15', '◆', 'J'), (40, 'Qualifier 16', 'Q16', '◆', 'J'),
    (41, 'Qualifier 17', 'Q17', '◆', 'K'), (42, 'Qualifier 18', 'Q18', '◆', 'K'),
    (43, 'Qualifier 19', 'Q19', '◆', 'K'), (44, 'Qualifier 20', 'Q20', '◆', 'K'),
    (45, 'Qualifier 21', 'Q21', '◆', 'L'), (46, 'Qualifier 22', 'Q22', '◆', 'L'),
    (47, 'Qualifier 23', 'Q23', '◆', 'L'), (48, 'Qualifier 24', 'Q24', '◆', 'L')
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
    ('Round of 32', 0, 1, 25), ('Round of 32', 1, 4, 26),
    ('Round of 32', 2, 2, 27), ('Round of 32', 3, 5, 28),
    ('Round of 32', 4, 3, 29), ('Round of 32', 5, 6, 30),
    ('Round of 32', 6, 7, 31), ('Round of 32', 7, 10, 32),
    ('Round of 32', 8, 11, 33), ('Round of 32', 9, 18, 34),
    ('Round of 32', 10, 8, 35), ('Round of 32', 11, 12, 36),
    ('Round of 32', 12, 13, 37), ('Round of 32', 13, 20, 38),
    ('Round of 32', 14, 9, 39), ('Round of 32', 15, 22, 40),
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
