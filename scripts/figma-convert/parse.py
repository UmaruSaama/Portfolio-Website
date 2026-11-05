import re, json
def parse(code):
    tok=re.compile(r'<(/?)(\w+)((?:[^>"{]|"[^"]*"|\{[^}]*\})*?)(/?)>',re.S)
    stack=[]; order=[]
    for m in tok.finditer(code):
        close,tag,attrs,selfc=m.groups()
        if close:
            if stack:
                n=stack.pop(); n['end']=m.end()
            continue
        idm=re.search(r'data-node-id="([^"]+)"',attrs); nm=re.search(r'data-name="([^"]*)"',attrs)
        src=re.search(r'src=\{(\w+)\}',attrs)
        n={'id':idm.group(1) if idm else None,'name':nm.group(1) if nm else '','tag':tag,'start':m.start(),'tagend':m.end(),'depth':len(stack),'parent':stack[-1] if stack else None,'src':src.group(1) if src else None,'attrs':attrs}
        order.append(n)
        if selfc: n['end']=m.end()
        else: stack.append(n)
    return order
RASTER=re.compile(r'^(Browser card|Phone · \d.*|Phone · 3\.2.*)$')
def is_raster(n): return bool(RASTER.match(n['name']))
