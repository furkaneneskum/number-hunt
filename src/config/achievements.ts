import type { AchievementDefinition } from '../types';
import { tr } from '../i18n/tr';

const items = tr.achievementItems;

export const ACHIEVEMENTS: AchievementDefinition[] = [
  { id: 'first-guess', title: items.firstGuess.title, description: items.firstGuess.description, icon: '🏆' },
  { id: 'lucky-seven', title: items.luckySeven.title, description: items.luckySeven.description, icon: '🏆' },
  { id: 'number-master', title: items.numberMaster.title, description: items.numberMaster.description, icon: '🏆' },
  { id: 'speed-demon', title: items.speedDemon.title, description: items.speedDemon.description, icon: '🏆' },
  { id: 'perfect-game', title: items.perfectGame.title, description: items.perfectGame.description, icon: '🏆' },
  { id: 'hintless', title: items.hintless.title, description: items.hintless.description, icon: '🏆' },
  { id: 'insane-win', title: items.insaneWin.title, description: items.insaneWin.description, icon: '🏆' },
  { id: 'unstoppable', title: items.unstoppable.title, description: items.unstoppable.description, icon: '🏆' },
];

export function getAchievementById(id: string): AchievementDefinition | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
