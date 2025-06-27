import { editPage } from './wiki.util';

import type Wikiapi from 'wikiapi';
import type { Season } from '../../../SharedLibrary/src/interface';

interface NavData {
  crops: Record<Season, string[]>;
}

function buildItemList(items: string[]) {
  return items.map((i) => `[[${i}]]`).join(' • ');
}

async function generateNavBoxCrop(wiki: Wikiapi, data: NavData) {
  await editPage(
    wiki,
    'NavboxCrop',
    `<includeonly>{| class="wikitable" id="navbox"
! colspan="2" | [[Crops]]
|-
![[Spring#Crops|Spring]]
|${buildItemList(data.crops.SPRING)}
|-
![[Summer#Crops|Summer]]
|${buildItemList(data.crops.SPRING)}
|-
![[Fall#Crops|Fall]]
|${buildItemList(data.crops.SPRING)}
|-
![[Winter#Crops|Fall]]
|${buildItemList(data.crops.WINTER)}
|-
|}</includeonly><noinclude>{{{{FULLPAGENAME}}/doc}}</noinclude>
`
  );
}

export async function generateNavigation(wiki: Wikiapi, data: NavData) {
  await generateNavBoxCrop(wiki, data);
}
