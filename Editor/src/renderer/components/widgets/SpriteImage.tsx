import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';

import { IMAGE_FILE_EXTENSION } from '../../../../../SharedLibrary/src/constants';
import { useAppSelector } from '../../hooks';
import { selectPath } from '../../store/slices/data';
import { getSectionPath } from '../../util/sprite.util';
import usePath from '../data-view/views/gameData/hooks/usePath';

import type { Section } from '../../../../../SharedLibrary/src/interface';

export interface SpriteImageProps {
  dataKey?: string;
  width?: number;
  height?: number;
  sprite: number;
  type: Section;
  targetHeight?: number;
  targetWidth?: number;
  targetSize?: number;
  errorMessage?: string;
  errorStyle?: 'full' | 'inline';
  onChange?: () => void;
}

interface SizeState {
  width: number;
  height: number;
}

const SpriteImage = ({
  dataKey,
  width = 16,
  height = 16,
  sprite,
  type,
  targetSize = 32,
  targetHeight = targetSize,
  targetWidth = targetSize,
  errorMessage = 'Sprite not found',
  errorStyle = 'full'
}: // onChange = () => {}
SpriteImageProps) => {
  const [size, setSize] = useState<SizeState | undefined>(undefined);
  // const [dataUrl, setDataUrl] = useState<string | undefined>();
  const [showError, setShowError] = useState<boolean>(false);

  const path = useAppSelector(selectPath);
  const imagePath = usePath(path, '..', getSectionPath(type), `${dataKey?.toLowerCase()}${IMAGE_FILE_EXTENSION}`);

  useEffect(() => {
    let alive = true;

    async function getSize() {
      if (!imagePath) {
        return;
      }

      const imageSize = await window.api.sizeOf(imagePath);
      if (alive) {
        setSize({
          width: imageSize.width || width,
          height: imageSize.height || height
        });
      }
    }

    getSize();
    return () => {
      alive = false;
    };
  }, [imagePath, width, height]);

  const columns = (size?.width ?? 0) / width;
  const rows = (size?.height ?? 0) / height;

  let row: number = rows - 1;
  let column: number = columns - 1;
  if (sprite >= 0) {
    row = Math.floor(sprite / columns);
    column = Math.floor(sprite % columns);
  }

  let resizeFactor: number;
  if (height > width) {
    resizeFactor = targetHeight / height;
  } else {
    resizeFactor = targetWidth / width;
  }
  resizeFactor = Math.max(Math.floor(resizeFactor * 2) / 2, 0.5);

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
    if (showError) {
      return;
    }
    const timer = setTimeout(() => setShowError(true), 2500);
    return () => clearTimeout(timer);
  }, [showError]);

  if (!imagePath || !size || !imagePath) {
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

  const adjustedWidth = width * resizeFactor;
  const adjustedHeight = height * resizeFactor;

  const adjustedImageWidth = size.width * resizeFactor;
  const adjustedImageHeight = size.height * resizeFactor;

  console.log('imagePath', imagePath);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: targetWidth,
        height: targetHeight
      }}
    >
      <div
        style={{
          display: 'flex',
          height: adjustedHeight,
          width: adjustedWidth,
          backgroundImage: `url(file://${imagePath})`,
          backgroundSize: `${adjustedImageWidth}px ${adjustedImageHeight}px`,
          backgroundPosition: `${-1 * adjustedWidth * column}px ${-1 * adjustedHeight * row}px`,
          imageRendering: 'pixelated'
        }}
      />
    </Box>
  );
};

export default SpriteImage;
