import { create } from 'zustand';
import { Activity } from '../models';

type ActivityState = {
  activities: Activity[];
  /** @param ts Time in seconds (should be a number but in string format) */
  addActivity: (username: string, type: string, ts?: string) => void;
};

export const useActivityStore = create<ActivityState>()((set) => ({
  activities: [],
  addActivity(username, type, ts) {
    set((state) => {
      const activities = [...state.activities];

      const activity = new Activity(username, type);

      if (ts) {
        activity.createdTs = ts;
      }

      activities.unshift(activity);

      return {
        activities: activities.slice(0, 10),
      };
    });
  },
}));
