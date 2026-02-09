import React from 'react';
import './LegoBattleBackground.css';

interface LegoBattleBackgroundProps {
  className?: string;
}

export const LegoBattleBackground: React.FC<LegoBattleBackgroundProps> = ({ className }) => {
  // Generate some random floating blocks
  const blocks = React.useMemo(() => {
    const colors = ['#E3000B', '#0055BF', '#F2CD37', '#237841'];
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 5,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 1
    }));
  }, []);

  return (
    <div className={`lego-bg-container ${className || ''}`}>
      <div className="lego-plate">
        {/* Render a grid of studs - simplified for performance */}
        {Array.from({ length: 400 }).map((_, i) => (
          <div key={i} className="stud" />
        ))}
      </div>
      
      {/* Floating debris */}
      {blocks.map((block) => (
        <div
          key={block.id}
          className="floating-block"
          style={{
            left: `${block.x}%`,
            top: `${block.y}%`,
            '--color': block.color,
            '--rotation': `${block.rotation}deg`,
            animationDelay: `${block.delay}s`,
            transform: `scale(${block.scale})`
          } as any}
        />
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
    </div>
  );
};
