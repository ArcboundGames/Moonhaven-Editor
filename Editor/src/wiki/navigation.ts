import { wikiFileName } from './filename';

import type { Season } from '../../../SharedLibrary/src/interface';
import type { WikiPage } from './types';

interface NavData {
  crops: Record<Season, string[]>;
}

function buildItemList(items: string[]) {
  return items.map((item) => `[[${item}]]`).join(' • ');
}

export function buildNavBoxCrop(data: NavData): WikiPage {
  return {
    id: 'template-navbox-crop',
    title: 'NavboxCrop',
    sourceKeys: Object.values(data.crops).flat(),
    images: [],
    content: `<includeonly>{| class="wikitable" id="navbox"
! colspan="2" | [[Crops]]
|-
![[Spring#Crops|Spring]]
|${buildItemList(data.crops.SPRING)}
|-
![[Summer#Crops|Summer]]
|${buildItemList(data.crops.SUMMER)}
|-
![[Fall#Crops|Fall]]
|${buildItemList(data.crops.FALL)}
|-
![[Winter#Crops|Winter]]
|${buildItemList(data.crops.WINTER)}
|-
|}</includeonly><noinclude>{{{{FULLPAGENAME}}/doc}}</noinclude>
`
  };
}

export async function generateNavigation() {
  throw new Error('Use wiki:build for offline navigation generation. wiki:publish uploads the built pages.');
}

export { wikiFileName };
