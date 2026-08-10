import { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { ModeSelector } from '../components/game/ModeSelector';
import { DifficultySelector } from '../components/game/DifficultySelector';
import { ScoreBoard } from '../components/game/ScoreBoard';
import { GameCard } from '../components/game/GameCard';
import { GuessInput } from '../components/game/GuessInput';
import { ResultMessage } from '../components/game/ResultMessage';
import { HintButton } from '../components/game/HintButton';
import { GameEndModal } from '../components/game/GameEndModal';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DIFFICULTIES } from '../config/gameConfig';
import { tr } from '../i18n/tr';
import type { GameModeId, DifficultyId } from '../types';

export function PlayPage() {
  const {
    gameState,
    player,
    startGame,
    submitGuess,
    endGame,
    dailyChallenge,
    updateSettings,
  } = useGameContext();

  const [selectedMode, setSelectedMode] = useState<GameModeId>(player.settings.mode);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyId>(player.settings.difficulty);

  useEffect(() => {
    updateSettings({ mode: selectedMode, difficulty: selectedDifficulty });
  }, [selectedMode, selectedDifficulty, updateSettings]);

  const handleStart = () => {
    startGame(selectedMode, selectedDifficulty);
  };

  if (!gameState) {
    return (
      <div className="page play-page">
        <h1 className="page-title">{tr.play.title}</h1>
        <p className="page-subtitle">{tr.play.subtitle}</p>

        <ModeSelector selected={selectedMode} onChange={setSelectedMode} />
        <DifficultySelector selected={selectedDifficulty} onChange={setSelectedDifficulty} />

        {selectedMode === 'challenge' && (
          <Card className="challenge-card">
            <h3>🏅 {tr.play.dailyChallenge}</h3>
            <p>{dailyChallenge.description}</p>
            {player.dailyChallengeCompleted && (
              <p className="challenge-card__completed">{tr.play.completedToday}</p>
            )}
          </Card>
        )}

        <Button size="lg" onClick={handleStart} className="play-start-btn">
          {tr.play.startGame}
        </Button>
      </div>
    );
  }

  const diff = DIFFICULTIES[gameState.difficulty];
  const isPlaying = gameState.gameStatus === 'playing';

  return (
    <div className="page play-page play-page--active">
      <ScoreBoard />

      <GameCard gameState={gameState} />

      {isPlaying && (
        <>
          <GuessInput
            onSubmit={submitGuess}
            disabled={!isPlaying}
            min={diff.min}
            max={diff.max}
          />
          <ResultMessage />
          <HintButton />
          <Button variant="ghost" onClick={endGame} className="quit-btn">
            {tr.play.quitGame}
          </Button>
        </>
      )}

      {gameState.gameStatus === 'won' && <GameEndModal type="won" />}
      {gameState.gameStatus === 'lost' && <GameEndModal type="lost" />}
    </div>
  );
}
