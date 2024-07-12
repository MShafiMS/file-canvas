import { COLLABORATOR, PRIVACY } from '@enums';
import sketchService from '@services/sketch.service';
import { ElementData } from '@types';
import { flow, Instance, types as t } from 'mobx-state-tree';

// Define Collaborator model
const Collaborator = t.model('Collaborator', {
  user: t.string,
  type: t.enumeration<COLLABORATOR>('COLLABORATOR', Object.values(COLLABORATOR)),
});

// Define Sketch model
export const Sketch = t
  .model('Sketch', {
    _id: t.identifier,
    title: t.string,
    elements: t.array(t.frozen<ElementData>()),
    createdBy: t.string,
    privacy: t.enumeration('PRIVACY', Object.values(PRIVACY)),
    collaborators: t.maybe(t.array(Collaborator)),
    isSaved: t.optional(t.boolean, false),
    isLoading: t.optional(t.boolean, false),
  })
  .actions((self) => ({
    insertElements: flow(function* (elements: ElementData[], title?: string) {
      self.elements.replace(elements);
      self.title = title || self.title;
      self.isLoading = true;
      const res = yield sketchService.updateSketch(self._id, self);
      if (res) console.log(res);
      self.isLoading = false;
      self.isSaved = true;
    }),
  }))
  .views((self) => ({}));

// Define the IUser type based on the Sketch model
export type ISketch = Instance<typeof Sketch>;
