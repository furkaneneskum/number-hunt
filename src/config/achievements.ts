import type { AchievementDefinition } from '../types';

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first-guess',
    title: 'First Guess',
    description: 'Make your first correct guess.',
    icon: '🏆',
  },
  {
    id: 'lucky-seven',
    title: 'Lucky Seven',
    description: 'Reach a 7 streak.',
    icon: '🏆',
  },
  {
    id: 'number-master',
    title: 'Number Master',
    description: 'Make 100 correct guesses.',
    icon: '🏆',
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Score 10+ in Time Attack.',
    icon: '🏆',
  },
  {
    id: 'perfect-game',
    title: 'Perfect Game',
    description: 'Win without any wrong guesses.',
    icon: '🏆',
  },
  {
    id: 'hintless',
    title: 'Hintless',
    description: 'Win without using any hints.',
    icon: '🏆',
  },
  {
    id: 'insane-win',
    title: 'Insane',
    description: 'Win on Insane difficulty.',
    icon: '🏆',
  },
  {
    id: 'unstoppable',
    title: 'Unstoppable',
    description: 'Reach a 20 streak.',
    icon: '🏆',
  },
];

export function getAchievementById(id: string): AchievementDefinition | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
