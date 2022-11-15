import { useState } from 'react';

import { isNullish } from '../../../../../../../../SharedLibrary/src/util/null.util';
import { useAsyncEffect } from '../../../../../hooks';

export default function usePath(...paths: (string | undefined)[]) {
  const [path, setPath] = useState<string | undefined>();

  useAsyncEffect(
    async () => {
      if (paths.find(isNullish)) {
        return undefined;
      }

      return (await window.api.join(...(paths as string[]))).replace(/\\/g, '/');
    },
    setPath,
    paths
  );

  return path;
}
