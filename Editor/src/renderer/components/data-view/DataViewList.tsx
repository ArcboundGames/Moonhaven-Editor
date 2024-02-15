import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import scrollParentToChild from '../../util/scroll.util';
import SpriteImage from '../widgets/SpriteImage';

import type { Section } from '../../../../../SharedLibrary/src/interface';

export interface DataViewListItem {
  dataKey?: string;
  imageKey?: string;
  name: string;
  sprite?: {
    key?: string;
    section?: Section;
    width?: number;
    height?: number;
    default?: number;
  };
  errors: string[];
  path?: string;
  pinned?: boolean;
}

export interface DataViewListProps {
  section: Section;
  items: DataViewListItem[];
  type?: 'left-nav' | 'card';
  search?: string;
  onSpritesChange?: () => void;
}

const DataViewList = ({ section, items, type = 'left-nav', search = '', onSpritesChange }: DataViewListProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = useCallback(
    (dataKey?: string, path?: string) => {
      if (path) {
        if (location.pathname === path) {
          return;
        }
        navigate(`${path}${search}`);
        return;
      }

      if (!dataKey) {
        if (location.pathname === `/${section}`) {
          return;
        }
        navigate(`/${section}${search}`);
        return;
      }

      if (location.pathname === `/${section}/${dataKey}`) {
        return;
      }
      navigate(`/${section}/${dataKey}${search}`);
    },
    [location.pathname, navigate, search, section]
  );

  const sortedItems = useMemo(() => {
    const itemsSorted = [...items];
    itemsSorted.sort((item1, item2) => {
      if (item1.pinned !== item2.pinned) {
        if (item1.pinned) {
          return -1;
        }

        return 1;
      }
      return item1.name.localeCompare(item2.name);
    });
    return itemsSorted;
  }, [items]);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollParentToChild(
        document.getElementById(`data-view-list-${section}`),
        document.getElementById(`data-view-list-${location.pathname}`)
      );
    });
    return () => clearTimeout(timer);
  }, [location.pathname, section]);

  const isSelected = useCallback(
    (dataKey?: string, path?: string) => {
      if (path) {
        return location.pathname === path;
      }

      if (!dataKey) {
        return location.pathname === `/${section}`;
      }

      return location.pathname === `/${section}/${dataKey}`;
    },
    [location.pathname, section]
  );

  return (
    <Box
      sx={{
        height: type === 'left-nav' ? '100%' : 'calc(100% - 71px)',
        width: type === 'left-nav' ? '280px' : '100%'
      }}
    >
      <Box sx={{ width: '100%', bgcolor: 'background.paper', height: '100%' }}>
        <Box component="nav" sx={{ height: '100%' }}>
          <List sx={{ height: '100%', boxSizing: 'border-box' }}>
            <Box
              sx={{
                width: '100%',
                paddingTop: 0.5,
                paddingRight: 1,
                paddingLeft: 1,
                marginBottom: 2,
                boxSizing: 'border-box'
              }}
            >
              <Button variant="contained" sx={{ width: '100%' }} onClick={() => handleClick('new')}>
                New {section.replace(/-/g, ' ')}
              </Button>
            </Box>
            <Box
              id={`data-view-list-${section}`}
              sx={{ overflowY: 'auto', height: 'calc(100% - 49px)', minHeight: '56px' }}
            >
              {sortedItems.map(({ dataKey, name, sprite, errors = [], path, pinned }) => (
                <ListItem
                  id={`data-view-list-/${section}/${dataKey}`}
                  key={`data-view-list-${dataKey}`}
                  disablePadding
                  sx={
                    pinned
                      ? {
                          backgroundColor: 'rgb(19, 47, 76)'
                        }
                      : {}
                  }
                >
                  <ListItemButton onClick={() => handleClick(dataKey, path)} selected={isSelected(dataKey, path)}>
                    {sprite && (
                      <Box
                        sx={{
                          width: '32px',
                          height: '32px',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: '#fff',
                          flexShrink: 0,
                          display: 'flex',
                          marginRight: '16px'
                        }}
                      >
                        <SpriteImage
                          dataKey={sprite.key ?? dataKey}
                          width={sprite.width}
                          height={sprite.height}
                          sprite={sprite.default ?? 0}
                          targetSize={32}
                          type={sprite.section ?? section}
                          errorStyle="inline"
                          onChange={onSpritesChange}
                        />
                      </Box>
                    )}
                    <ListItemText primary={name} />
                    {errors.length ? <ReportProblemIcon color="error" titleAccess={errors.join(', ')} /> : null}
                  </ListItemButton>
                </ListItem>
              ))}
            </Box>
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default DataViewList;
