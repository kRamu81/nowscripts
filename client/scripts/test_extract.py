
import re, json
for path, name in [('C:/Users/hp/.gemini/antigravity/brain/efffd16c-212d-4474-b4f7-58a433db6d63/.system_generated/steps/5511/content.md', 'csa'), ('C:/Users/hp/.gemini/antigravity/brain/efffd16c-212d-4474-b4f7-58a433db6d63/.system_generated/steps/5522/content.md', 'cad')]:
    data = open(path, 'r', encoding='utf-8').read()
    match = re.search(r'const quizData = (\[.*?\])(?=\s*function|\s*</script>|\s*$|\s*let)', data, re.DOTALL)
    if match:
        try:
            arr = json.loads(match.group(1))
            print(f'{name}: {len(arr)}')
            open(f'{name}_raw.json', 'w').write(json.dumps(arr))
        except Exception as e:
            print(name, e)
            print(match.group(1)[-100:])
    else:
        print(f'{name} no match')
