from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import re
class Doc(HTMLParser):
 def __init__(self,text):
  super().__init__();self.ids=set();self.links=[];self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.add(a['id'])
  if 'name' in a:self.ids.add(a['name'])
  for k in ['href','src']:
   if k in a:self.links.append(a[k])
root=Path.cwd();docs={f.resolve():Doc(f.read_text()) for f in root.rglob('*.html') if '.git' not in f.parts};errors=[];count=0
for f,doc in docs.items():
 for v in doc.links:
  u=urlsplit(v)
  if u.scheme or u.netloc or not v:continue
  target=(f.parent/unquote(u.path)).resolve() if u.path else f
  if target.is_dir():target=target/'index.html'
  count+=1
  if not target.exists():errors.append((f.name,v,'missing file'))
  elif u.fragment and target in docs and unquote(u.fragment) not in docs[target].ids:errors.append((f.name,v,'missing anchor'))
print('Checked',count,'local links/assets. Errors:',errors)
chapters=[]
for file in ['writing-method.html','project-foundation.html','architecture-topics.html','universal-template.html','training-plan.html']:
 chapters += list(map(int,re.findall(r'<h1 id="[^"]+">(\d+)\.',Path(file).read_text())))
assert sorted(chapters)==list(range(1,33)),chapters
assert 'id="content"' not in Path('index.html').read_text()
assert all('data-resource-files' not in f.read_text() for f in Path('resources').glob('*.html'))
assert not errors
print('All 32 chapters preserved once; home is navigation only; resource wrappers removed.')
