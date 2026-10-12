from docx import Document
import json,html,os
p='/mnt/data/MATRICE RF - ORIGINALE SIMPLE.docx'; d=Document(p)
menus=[]
for s in d.element.body.iter():
 if s.tag.endswith('}sdt'):
  pr=s.find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}sdtPr')
  if pr is None:continue
  node=pr.find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}dropDownList')
  if node is None:node=pr.find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}comboBox')
  if node is not None:
   vals=[x.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}displayText') or x.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}value') or '' for x in node]
   menus.append(vals)
open('/mnt/data/dlf35-webapp/menus.json','w').write(json.dumps(menus,ensure_ascii=False))
print(len(menus),sum(map(len,menus)))
