import { FullScreenLoader } from '@components/core';
import { Canvas } from '@modules/Drawings/components/Canvas';
import { useStores } from '@stores';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const Drawing = observer(() => {
  const { sketchStore } = useStores();
  const { sketches, selectedSketch } = sketchStore;
  const router = useRouter();
  const templateId = router.query.drawing as string;
  const handleClose = () => {
    router.back();
  };

  useEffect(() => {
    const sketch = sketches.find((sketch) => sketch._id === templateId);
  }, [templateId]);

  if (!selectedSketch) return <FullScreenLoader />;
  return <Canvas onClose={handleClose} template={selectedSketch} />;
});
