import Box from '@mui/system/Box';
import { useMemo } from 'react';

import { useAppSelector, useDebounce } from '../../../hooks';
import { selectSearch } from '../../../store/slices/data';
import { selectSkillErrors, selectSkillsSortedWithName } from '../../../store/slices/skills';
import DataViewList from '../DataViewList';

import type { DataViewListItem } from '../DataViewList';

const SkillList = () => {
  const skills = useAppSelector(selectSkillsSortedWithName);

  const errors = useAppSelector(selectSkillErrors);

  const searchTerm = useAppSelector(selectSearch);
  const debouncedSearchTerm = useDebounce(searchTerm?.toLowerCase(), 250);

  const filteredSkills = useMemo(() => {
    if (!debouncedSearchTerm) {
      return skills;
    }
    return skills.filter((skill) => skill.name.replace(/_/g, ' ').toLowerCase().includes(debouncedSearchTerm));
  }, [debouncedSearchTerm, skills]);

  const listItems: DataViewListItem[] = filteredSkills.map((skill) => {
    return {
      dataKey: `${skill.key}`,
      name: skill.name,
      errors: errors[skill.key]
    };
  });

  return (
    <Box sx={{ height: '100%' }}>
      <DataViewList section="skill" items={listItems} />
    </Box>
  );
};

export default SkillList;
