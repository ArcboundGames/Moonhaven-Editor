import AddIcon from '@mui/icons-material/Add';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { LOOT_TABLES_DATA_FILE } from '../../../../../../../SharedLibrary/src/constants';
import { validateLootTable } from '../../../../../../../SharedLibrary/src/dataValidation';
import { toTitleCaseFromKey } from '../../../../../../../SharedLibrary/src/util/string.util';
import { useAppDispatch, useAppSelector, useDebounce } from '../../../../hooks';
import { selectItemTypesByKey } from '../../../../store/slices/items';
import {
  selectLootTable,
  selectLootTables,
  selectLootTablesByKey,
  updateLootTables
} from '../../../../store/slices/lootTables';
import { getNewLootTable } from '../../../../util/section.util';
import TextField from '../../../widgets/form/TextField';
import Card from '../../../widgets/layout/Card';
import FormBox from '../../../widgets/layout/FormBox';
import DataViewer from '../../DataViewer';
import LootTableComponentGroupCard from './lootTableView/LootTableComponentGroupCard';

import type { LootTable, LootTableComponentGroup } from '../../../../../../../SharedLibrary/src/interface';

function createLootTableComponentGroup(): LootTableComponentGroup {
  return {
    probability: 0,
    components: []
  };
}

const LootTableView = () => {
  const { dataKey = '' } = useParams();

  const dispatch = useAppDispatch();

  const [errors, setErrors] = useState<string[] | undefined>(undefined);

  const lootTable = useAppSelector(selectLootTable(dataKey));
  const lootTables = useAppSelector(selectLootTables);
  const lootTablesByKey = useAppSelector(selectLootTablesByKey);

  const itemsById = useAppSelector(selectItemTypesByKey);

  const defaultValue = useMemo(() => getNewLootTable(lootTablesByKey), [lootTablesByKey]);

  const [editData, setEditData] = useState<LootTable | undefined>(dataKey === 'new' ? defaultValue : lootTable);
  const debouncedEditData = useDebounce(editData, 500);
  useEffect(() => {
    if (!debouncedEditData) {
      return;
    }

    setErrors(validateLootTable(debouncedEditData, itemsById));
  }, [debouncedEditData, itemsById]);

  const validate = useCallback((data: LootTable) => validateLootTable(data, itemsById), [itemsById]);

  const onSave = useCallback((dataSaved: LootTable[]) => dispatch(updateLootTables(dataSaved)), [dispatch]);

  const getName = useCallback(
    (data: LootTable) => (data.key.length > 0 ? toTitleCaseFromKey(data.key) : 'Unknown Loot Table'),
    []
  );

  const getHeader = useCallback(
    (data: LootTable) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box>{getName(data)}</Box>
        {errors && errors.length > 0 ? (
          <ReportProblemIcon color="error" sx={{ ml: 1 }} titleAccess={errors.join(', ')} />
        ) : null}
      </Box>
    ),
    [errors, getName]
  );

  const onDataChange = useCallback((data: LootTable | undefined) => setEditData(data), []);

  const getFileData = useCallback(
    () => ({
      lootTables
    }),
    [lootTables]
  );

  return (
    <DataViewer
      dataKey={dataKey}
      valueDataKey={editData?.key}
      section="loot-table"
      file={LOOT_TABLES_DATA_FILE}
      fileSection="lootTables"
      value={lootTable}
      defaultValue={defaultValue}
      getFileData={getFileData}
      getName={getName}
      getHeader={getHeader}
      validate={validate}
      onSave={onSave}
      onDataChange={onDataChange}
    >
      {({ data, handleOnChange, disabled }) => (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 3fr' }}>
          <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
            <Card header="General">
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr' }}>
                <FormBox>
                  <TextField
                    label="Key"
                    value={data.key}
                    onChange={(value) => handleOnChange({ key: value })}
                    required
                    disabled={disabled}
                  />
                </FormBox>
              </Box>
            </Card>
          </Box>
          <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
            <LootTableComponentGroupCard
              index={-1}
              group={data.defaultGroup}
              disabled={disabled}
              onChange={(newValue) => handleOnChange({ defaultGroup: newValue })}
              header={
                <Button
                  variant="contained"
                  size="medium"
                  endIcon={<AddIcon fontSize="medium" />}
                  disabled={disabled}
                  onClick={() => {
                    handleOnChange({ groups: [...data.groups, createLootTableComponentGroup()] });
                  }}
                >
                  Add Group
                </Button>
              }
            />
            {data.groups.map((group, index) => (
              <LootTableComponentGroupCard
                key={`group-${index}`}
                index={index}
                group={group}
                disabled={disabled}
                onChange={(newValue) => {
                  const newGroups = [...data.groups];
                  newGroups[index] = newValue;
                  handleOnChange({ groups: newGroups });
                }}
                onDelete={() => {
                  const newGroups = [...data.groups];
                  newGroups.splice(index, 1);
                  handleOnChange({ groups: newGroups });
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </DataViewer>
  );
};

export default LootTableView;
