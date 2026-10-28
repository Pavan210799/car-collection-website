"""Builds scripts/image-plan.json from the curated Unsplash source lists in scripts/sources/."""
import json
import pathlib

root = pathlib.Path(__file__).resolve().parent
sources = root / 'sources'

MODEL_TO_SLUG = {
    'Lamborghini Huracán STO': 'lamborghini-huracan-sto',
    'Lamborghini Aventador SVJ': 'lamborghini-aventador-svj',
    'Lamborghini Urus': 'lamborghini-urus-performante',
    'Ferrari SF90 Stradale': 'ferrari-sf90-stradale',
    'Ferrari F8 Tributo': 'ferrari-f8-tributo',
    'Ferrari Roma': 'ferrari-roma',
    'Porsche 911 GT3 RS': 'porsche-911-gt3-rs',
    'Porsche 911 Turbo S': 'porsche-911-turbo-s',
    'Porsche Taycan': 'porsche-taycan-turbo-s',
    'McLaren 720S': 'mclaren-720s',
    'Bugatti Chiron': 'bugatti-chiron',
    'Audi R8': 'audi-r8',
    'Rolls-Royce Cullinan': 'rolls-royce-cullinan',
    'Rolls-Royce Ghost': 'rolls-royce-ghost',
    'Bentley Continental GT': 'bentley-continental-gt',
    'Mercedes-AMG G 63': 'mercedes-amg-g63',
    'Mercedes-AMG GT': 'mercedes-amg-gt-r',
    'Aston Martin DB11': 'aston-martin-vantage',
    'Range Rover': 'range-rover-autobiography',
    'BMW M4': 'bmw-m4-competition',
    'Nissan GT-R': 'nissan-gt-r-nismo',
    'Chevrolet Corvette C8 Stingray': 'chevrolet-corvette-stingray',
    'Tesla Model S': 'tesla-model-s-plaid',
    'Ford Mustang': 'ford-mustang-gt',
}

ORDER_OVERRIDES = json.loads((root / 'image-order.json').read_text()) if (root / 'image-order.json').exists() else {}


def clean(desc):
    desc = desc.split(';')[0].split('(')[0].strip().rstrip(',')
    return desc[0].upper() + desc[1:] if desc else desc


plan = {'cars': {}, 'site': {}}
site_counts = {}

all_images = {}
for path in sorted(sources.glob('group-*.json')):
    data = json.loads(path.read_text())
    car_lists = data['cars'] if isinstance(data, dict) else data
    for car in car_lists:
        for image in car['images']:
            all_images[image['id']] = image
    if isinstance(data, dict):
        for image in data.get('site', []):
            all_images[image['id']] = image

for path in sorted(sources.glob('group-*.json')):
    data = json.loads(path.read_text())
    car_lists = data['cars'] if isinstance(data, dict) else data
    for car in car_lists:
        slug = MODEL_TO_SLUG.get(car['model'])
        if not slug:
            print(f'!! no slug for {car["model"]} ({path.name})')
            continue
        images = car['images']
        if slug in ORDER_OVERRIDES:
            images = [all_images[i] for i in ORDER_OVERRIDES[slug] if i in all_images]
        plan['cars'][slug] = [
            {'id': image['id'], 'author': image.get('author'), 'alt': clean(image['desc'])} for image in images
        ]
    if isinstance(data, dict):
        for image in data.get('site', []):
            role = image['role']
            site_counts[role] = site_counts.get(role, 0) + 1
            plan['site'][f'{role}-{site_counts[role]}'] = {
                'id': image['id'],
                'author': image.get('author'),
                'alt': clean(image['desc']),
            }

(root / 'image-plan.json').write_text(json.dumps(plan, indent=2, ensure_ascii=False) + '\n')
print(f"{len(plan['cars'])} cars, {sum(len(v) for v in plan['cars'].values())} car images, {len(plan['site'])} site images")
