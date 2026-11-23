-- Owner requested removal of saved worksheets using replaced written banks.
-- Run on the existing D1 database; does not deploy a Worker.
-- The obsolete Ali activity has no available audio and is also removed.
-- Current graded recipes, theory, CO and non-migrated notions are preserved.
WITH pages AS (
 SELECT f.id, p.value FROM fiches f, json_each(f.recipe, '$.pages') p
 UNION ALL
 SELECT f.id, p.value FROM fiches f, json_each(f.recipe, '$.libreSnapshot') p
), blocks AS (
 SELECT id,value FROM pages WHERE json_extract(value,'$.domain')='grammaire'
 UNION ALL
 SELECT p.id,b.value FROM pages p,json_each(p.value,'$.extraBlocks') b
 WHERE json_extract(p.value,'$.domain')='grammaire'
)
DELETE FROM fiches WHERE id IN (
 SELECT DISTINCT b.id FROM blocks b WHERE
 COALESCE(json_extract(b.value,'$.grammarLevel'),'')=''
 AND (EXISTS (SELECT 1 FROM json_each('["etre","er-particuliers","imparfait-ou-pc","i4","k10","avoir","aller-destination","er","ir","re-oir","modaux","pronominaux","a8","a9","b1","b2","b3","a2","a6","a1","a3","famille","c1","c2","c3","c4","d1","d2","d3","e1","e6","e7"]') s
 WHERE json_extract(b.value,'$.exerciseType') GLOB 'gram-ex-'||s.value||'-*')
 AND json_extract(b.value,'$.exerciseType') NOT LIKE '%-co-theme'
 AND json_extract(b.value,'$.exerciseType') NOT LIKE '%-co-audio'
 AND json_extract(b.value,'$.exerciseType') NOT LIKE '%-fam-co'
 AND json_extract(b.value,'$.exerciseType') NOT LIKE '%-nat-co'
 OR json_extract(b.value,'$.exerciseType')='gram-ex-a3-nat-co')
);
