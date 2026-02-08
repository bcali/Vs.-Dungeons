-- LEGO QUEST — Status Effect Definitions Seed Data

INSERT INTO status_effect_definitions (effect_type, category, display_name, description, icon_name, color, default_duration, stackable, value_schema) VALUES
-- Buffs
('str_buff',        'buff',   'STR Up',       'Increased Strength',                     'sword',        '#ef4444', 2, false, '{"stat":"str","value":"number"}'),
('agi_buff',        'buff',   'AGI Up',       'Increased Agility',                      'wind',         '#22c55e', 2, false, '{"stat":"agi","value":"number"}'),
('mna_buff',        'buff',   'MNA Up',       'Increased Mana Power',                   'sparkles',     '#3b82f6', 2, false, '{"stat":"mna","value":"number"}'),
('con_buff',        'buff',   'CON Up',       'Increased Constitution',                 'heart',        '#f97316', 2, false, '{"stat":"con","value":"number"}'),
('int_buff',        'buff',   'INT Up',       'Increased Intelligence',                 'brain',        '#a855f7', 2, false, '{"stat":"int","value":"number"}'),
('all_stats_buff',  'buff',   'Blessed',      'All stats increased',                    'star',         '#e5a91a', 2, false, '{"value":"number"}'),
('defense_up',      'buff',   'Defense Up',   'Increased defense target number',         'shield',       '#6366f1', 2, false, '{"value":"number"}'),
('damage_reduction','buff',   'Fortified',    'Incoming damage reduced',                 'shield-plus',  '#14b8a6', 2, false, '{"value":"number"}'),
('stealth',         'buff',   'Hidden',       'Cannot be targeted. Next attack crits.',  'eye-off',      '#6b7280', 2, false, '{"nextAttackCrit":"boolean"}'),
('unstoppable',     'buff',   'Unstoppable',  'Immune to CC effects',                    'zap',          '#eab308', 3, false, '{}'),
('invulnerable',    'buff',   'Invulnerable', 'Cannot take damage',                      'lock',         '#f59e0b', 2, false, '{}'),
('death_ward',      'buff',   'Death Ward',   'Revives at threshold HP if KO''d',        'heart-pulse',  '#ec4899', 3, false, '{"reviveHp":"number"}'),

-- Debuffs
('str_debuff',      'debuff', 'STR Down',     'Decreased Strength',                      'sword-off',    '#991b1b', 2, false, '{"stat":"str","value":"number"}'),
('agi_debuff',      'debuff', 'AGI Down',     'Decreased Agility',                       'snail',        '#166534', 2, false, '{"stat":"agi","value":"number"}'),
('slow',            'debuff', 'Slowed',       'Movement reduced by half',                'snail',        '#9333ea', 2, false, '{}'),
('taunt',           'debuff', 'Taunted',      'Must attack the taunting hero',            'megaphone',    '#dc2626', 2, false, '{"taunterIds":"string[]"}'),
('vulnerable',      'debuff', 'Vulnerable',   'Takes +2 damage from all sources',        'target',       '#f43f5e', 2, false, '{"extraDamage":"number"}'),

-- Crowd Control
('stun',            'cc',     'Stunned',      'Cannot act this turn',                    'zap-off',      '#fbbf24', 1, false, '{}'),
('root',            'cc',     'Rooted',       'Cannot move but can still attack',         'anchor',       '#84cc16', 2, false, '{}'),
('silence',         'cc',     'Silenced',     'Cannot use abilities',                     'volume-x',     '#e879f9', 2, false, '{}'),
('fear',            'cc',     'Frightened',   'Must move away from source',               'ghost',        '#a78bfa', 2, false, '{"sourceId":"string"}'),
('blind',           'cc',     'Blinded',      '-4 to all attack rolls',                   'eye-off',      '#4b5563', 2, false, '{"attackPenalty":"number"}'),

-- Damage Over Time
('poison',          'dot',    'Poisoned',     'Takes poison damage each turn',            'skull',        '#16a34a', 3, true,  '{"damage":"number"}'),
('burn',            'dot',    'Burning',      'Takes fire damage each turn',              'flame',        '#f97316', 2, true,  '{"damage":"number"}'),
('bleed',           'dot',    'Bleeding',     'Takes physical damage each turn',          'droplet',      '#dc2626', 3, true,  '{"damage":"number"}'),

-- Heal Over Time
('regen',           'hot',    'Regenerating', 'Heals HP each turn',                       'heart-pulse',  '#22c55e', 3, true,  '{"healing":"number"}'),
('blessed_heal',    'hot',    'Blessed Heal', 'Divine healing over time',                  'sparkles',     '#e5a91a', 3, false, '{"healing":"number"}');
