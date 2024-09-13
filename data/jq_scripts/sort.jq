# Sort a JSON file containing a member list for the Hongo Hep-th group.
# Sorting rules (null or undefined values are treated as lowest priority):
#    1. By `priority`
#    2. By `position.english` in the following order:
#       - Professor
#       - Associate Professor
#       - Assistant Professor
#       - Secretary
#       - PD
#       - if otherwise, it means some exceptional case. Treat is as the same as "null".
#    3. By `join` date (earlier dates come first; if month is null/undefined, treat as December)
#    4. By `name.lastName` alphabetically
#    5. By `name.firstName` alphabetically

# Given an input file `xxx.json`, if a backup `xxx_old.json` already exists, show a warning and stop.
# Otherwise, copy `xxx.json` to `xxx_old.json`, and replace `xxx.json` with the sorted result.
# If --newfile option is given, instead create xxx_new.json (warn and stop is already exists) and put the result into the new file.

def nulls_last: . // 9999;

def position_priority:
  (if . == null or startswith("D") or startswith("M") then nulls_last
   elif . == "Professor" then 1
   elif . == "Associate Professor" then 2
   elif . == "Assistant Professor" then 3
   elif . == "Secretary" then 4
   elif . == "PD" then 5
   else nulls_last end);

def join_date(year; month):
  if year == null then nulls_last else year | tonumber end,
  if month == null then 12 else month | tonumber end;

sort_by(
  (nulls_last(.priority)),
  (position_priority(.position.english)),
  (join_date(.period.join.year; .period.join.month)),
  (.name.lastName),
  (.name.firstName)
)
