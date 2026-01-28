
import { Activity } from '../types';

const STORAGE_KEY = 'activities_v1';

export const storageService = {
  getActivities: (): Activity[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveActivities: (activities: Activity[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  },

  addActivity: (activity: Activity): void => {
    const activities = storageService.getActivities();
    storageService.saveActivities([...activities, activity]);
  },

  updateActivity: (updatedActivity: Activity): void => {
    const activities = storageService.getActivities();
    const newActivities = activities.map(a => a.id === updatedActivity.id ? updatedActivity : a);
    storageService.saveActivities(newActivities);
  },

  deleteActivity: (id: string): void => {
    const activities = storageService.getActivities();
    const newActivities = activities.filter(a => a.id !== id);
    storageService.saveActivities(newActivities);
  }
};
