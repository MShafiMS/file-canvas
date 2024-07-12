import { PRIVACY } from '@enums';
import sketchService from '@services/sketch.service';
import ObjectID from 'bson-objectid';
import { flow, getRoot, Instance, types as t } from 'mobx-state-tree';
import { ISketch, Sketch } from './models';
import { IStore } from './root.store';

export const SketchStore = t
  .model('SketchStore', {
    sketchMap: t.map(Sketch),
    templates: t.array(Sketch),
    selectedSketchId: t.maybeNull(t.string),
    isLoading: t.optional(t.boolean, false),
  })
  .actions((self) => ({
    addSketches(sketches: ISketch[], isSaved = false) {
      sketches.forEach((sketch) => {
        self.sketchMap.set(sketch._id, { ...sketch, isSaved });
      });
    },
  }))
  .views((self) => ({
    get selectedSketch() {
      if (!self.selectedSketchId) return;
      const template = self.templates.find((tem) => tem._id === self.selectedSketchId);
      const sketch = self.sketchMap.get(self.selectedSketchId);
      return template || sketch;
    },

    get sketches() {
      const sketches = Array.from(self.sketchMap.values());
      return sketches.filter((sketch) => sketch.isSaved);
    },
  }))
  .actions((self) => ({
    setSelectedSketchId(id: string | null) {
      self.selectedSketchId = id;
    },

    createSketch(): ISketch {
      const createdBy = getRoot<IStore>(self).userStore.loggedInUserId;
      const sketch = Sketch.create({
        _id: ObjectID().toHexString(),
        title: 'Untitled',
        elements: [],
        privacy: PRIVACY.PRIVATE,
        createdBy: createdBy || '',
      });
      const exixstSketch = self.sketches.find((sketch) => !sketch.isSaved);
      if (exixstSketch) return exixstSketch;
      self.sketchMap.set(sketch._id, sketch);
      return sketch;
    },

    deleteSketch(id: string) {
      self.sketchMap.delete(id);
    },

    loadSketches: flow(function* () {
      const createdBy = getRoot<IStore>(self).userStore.loggedInUserId;
      if (!createdBy) return;
      const res = yield sketchService.getAllSketches(createdBy);
      if (res) self.addSketches(res, true);
    }),
  }));

export type ISketchStore = Instance<typeof SketchStore>;
