import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';

import {
  IMAGE_FILE_EXTENSION,
  PORTRAIT_DISPLAY_HEIGHT,
  PORTRAIT_DISPLAY_WIDTH,
  PORTRAIT_HEIGHT,
  PORTRAIT_RESIZE_FACTOR,
  PORTRAIT_WIDTH
} from '../../../../../SharedLibrary/src/constants';
import { useAppSelector } from '../../hooks';
import { selectPath } from '../../store/slices/data';
import { getSectionPath } from '../../util/sprite.util';
import usePath from '../data-view/views/gameData/hooks/usePath';

export interface PortraitProps {
  dataKey?: string;
  errorMessage?: string;
  errorStyle?: 'full' | 'inline';
  onChange?: () => void;
}

interface SizeState {
  width: number;
  height: number;
}

const Portrait = ({ dataKey, errorMessage = 'Portrait not found', errorStyle = 'full' }: PortraitProps) => {
  const [size = { width: 0, height: 0 }, setSize] = useState<SizeState | undefined>(undefined);
  const [dataUrl, setDataUrl] = useState<string | undefined>();
  const [showError, setShowError] = useState<boolean>(false);

  const path = useAppSelector(selectPath);

  const imagePath = usePath(
    path,
    '..',
    getSectionPath('creature'),
    `${dataKey?.toLowerCase()}-portrait${IMAGE_FILE_EXTENSION}`
  );

  useEffect(() => {
    let alive = true;

    async function getSize() {
      if (!imagePath) {
        return;
      }

      const imageSize = await window.api.sizeOf(imagePath);
      if (alive) {
        setSize({
          width: imageSize.width || PORTRAIT_WIDTH,
          height: imageSize.height || PORTRAIT_HEIGHT
        });
      }
    }

    getSize();
    return () => {
      alive = false;
    };
  }, [imagePath]);

  // const onImageChange = useCallback(
  //   (image: string | undefined) => {
  //     setDataUrl(image);
  //     if (!image) {
  //       setShowError(true);
  //     }
  //     onChange();
  //   },
  //   [onChange]
  // );

  useEffect(() => {
    let alive = true;

    async function scale() {
      if (!imagePath) {
        return;
      }

      const scaledImage = await window.api.scaleImage(imagePath, PORTRAIT_RESIZE_FACTOR);
      if (alive) {
        setDataUrl(scaledImage);
      }
    }

    scale();
    return () => {
      alive = false;
    };
  }, [imagePath]);

  useEffect(() => {
    if (showError) {
      return;
    }
    const timer = setTimeout(() => setShowError(true), 2500);
    return () => clearTimeout(timer);
  }, [showError]);

  if (!imagePath || !size || !dataUrl) {
    if (!showError) {
      return null;
    }
    return errorStyle === 'full' ? (
      <Alert severity="warning" title={errorMessage}>
        {errorMessage}
      </Alert>
    ) : (
      <ReportProblemIcon color="warning" />
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: PORTRAIT_DISPLAY_WIDTH,
        height: PORTRAIT_DISPLAY_HEIGHT
      }}
    >
      <div
        style={{
          display: 'flex',
          height: PORTRAIT_DISPLAY_HEIGHT,
          width: PORTRAIT_DISPLAY_WIDTH,
          backgroundImage: `url(${dataUrl})`,
          backgroundSize: `${PORTRAIT_DISPLAY_WIDTH}px ${PORTRAIT_DISPLAY_HEIGHT}px`
        }}
      />
    </Box>
  );
};

export default Portrait;
