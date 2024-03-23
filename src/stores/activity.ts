import { create } from 'zustand';
import { Activity } from '../models';

type ActivityState = {
  activities: Activity[];
  addActivity: (username: string, type: string) => void;
};

export const useActivityStore = create<ActivityState>()((set) => ({
  activities: [],
  addActivity(username, type) {
    set((state) => {
      const activities = [...state.activities];

      activities.unshift(new Activity(username, type));

      return {
        activities: activities.slice(0, 10),
      };
    });
  },
}));
