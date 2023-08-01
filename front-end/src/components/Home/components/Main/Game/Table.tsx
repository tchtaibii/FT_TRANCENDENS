import React from 'react';

let paddlepos1: number;
let paddlepos2: number = 0;
let halfpaddle = 2.5;
let ballposy: number;
let ballposx: number;

const Score = ({ leftScore, rightScore }: { leftScore: number; rightScore: number }) => {
  const leftScoreStyle: React.CSSProperties = {
    position: 'absolute',
    left: '15%',
    top: '0',
    textAlign: 'center',
    color: '#E15253',
    fontSize: '30rem',
    paddingTop: '5%',
    fontFamily: 'Arial, sans-serif',
    zIndex: 1,
    opacity: '0.1',
  };

  const rightScoreStyle: React.CSSProperties = {
    position: 'absolute',
    right: '15%',
    top: '0',
    textAlign: 'center',
    color: '#5699AF',
    fontSize: '30rem',
    paddingTop: '5%',
    fontFamily: 'Arial, sans-serif',
    zIndex: 1,
    opacity: '0.1',
  };

  return (
    <>
      <div style={leftScoreStyle}>
        {leftScore}
      </div>
      <div style={rightScoreStyle}>
        {rightScore}
      </div>
    </>
  );
};


const Paddle = ({ color, pos }: { color: string; pos: string }) => {
  const paddleStyle: React.CSSProperties = {
    width: '1.375rem', // 22px
    height: '6.625rem', // 106px
    backgroundColor: color,
    position: 'relative',
    top: pos,
    boxShadow: `0 0 1.25rem ${color}`, // 20px
    borderRadius: '1.25rem', // 20px
    marginInline: '1.25rem', // 20px
    zIndex: 6,
  };

  return <div style={paddleStyle}></div>;
};

const Ball = ({ color, setLeftScore, setRightScore, Ballspeed, setBallspeed, setGameOver, gameOver }: { color: string, setLeftScore: any, setRightScore: any, Ballspeed: number, setBallspeed: any, setGameOver: any, gameOver: any }) => {
  const [ballPos, setBallPos] = React.useState({ x: 0, y: 0 });
  const moveAngle = React.useRef(Math.PI / 4);  // direction of the ball in radians
  const animationFrameId = React.useRef<number>();

  const ballStyle: React.CSSProperties = {
    width: '1.5625rem', // 25px
    height: '1.5625rem', // 25px
    backgroundColor: color,
    borderRadius: '50%',
    position: 'relative',
    left: `${ballPos.x}rem`,
    top: `${ballPos.y}rem`,
    boxShadow: '0 0 1.25rem white' // 20px
  };

  const ballSpeedRef = React.useRef(Ballspeed);

  React.useEffect(() => {
    ballSpeedRef.current = Ballspeed;
  }, [Ballspeed]);

  React.useEffect(() => {
    const moveBall = () => {
      if (!gameOver) {
        setBallPos((prevPos) => {
          let newX = prevPos.x - (ballSpeedRef.current * Math.cos(moveAngle.current));
          let newY = prevPos.y - (ballSpeedRef.current * Math.sin(moveAngle.current));
          ballposy = newY;
          ballposx = newX;
          if (newX < -515 / 16 && (newY < paddlepos1 + halfpaddle && newY > paddlepos1 - halfpaddle)) {
            newX = -515 / 16;
            moveAngle.current = Math.PI - moveAngle.current;
            setBallspeed((prevspeed: number) => prevspeed + 0.3 / 16);
          }
          if (newX > 515 / 16 && (newY < paddlepos2 + halfpaddle && newY > paddlepos2 - halfpaddle)) {
            newX = 515 / 16;
            moveAngle.current = Math.PI - moveAngle.current;
            setBallspeed((prevspeed: number) => prevspeed + 0.3 / 16);
          }
          // han fin katmarka koraaaaaaaaa
          if ((newX < -575 / 16 || newX > 580 / 16)) {
            if (newX < -575 / 16) {
              setRightScore((prevScore: number) => {
                const newScore = prevScore + 1;
                if (newScore / 2 == 5) {
                  setGameOver(true);
                }
                return newScore;
              });
              setBallspeed(() => 0.7);
            }
            else if (newX > 580 / 16) {
              setLeftScore((prevScore: number) => {
                const newScore = prevScore + 1;
                if (newScore / 2 == 5) {
                  setGameOver(true);
                }
                return newScore;
              });
              setBallspeed(() => 0.7);
            }
            newX = 0;
            newY = 0;
          }

          if (newY < -320 / 16 || newY > 325 / 16) {
            newY = newY < -320 / 16 ? -320 / 16 : 325 / 16;
            moveAngle.current = -moveAngle.current;
            setBallspeed((prevspeed: number) => prevspeed + 0.3 / 16);
          }

          return { x: newX, y: newY };
        });

        animationFrameId.current = requestAnimationFrame(moveBall);
      }
    };

    moveBall();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameOver]);

  return <div style={ballStyle}></div>;
};


function Table({ leftscore, setLeftScore, rightscore, setRightScore }:any) {
  const [firstPaddlePos, setFirstPaddlePos] = React.useState(0);
  const movePaddle = React.useRef(0);

  const [secondPaddlePos, setSecondPaddlePos] = React.useState(0);



  const [Ballspeed, setBallspeed] = React.useState(0.7);

  const [gameOver, setGameOver] = React.useState(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'w') {
      movePaddle.current = -1;
    } else if (e.key === 'ArrowDown' || e.key === 's') {
      movePaddle.current = 1;
    }
  };

  const handleKeyUp = () => {
    movePaddle.current = 0; // 7bess
  };

  React.useEffect(() => {
    const updatePaddlePosition = () => {
      if (!gameOver) {
        setFirstPaddlePos((prev) => {
          const newPosition = prev + movePaddle.current;
          const maxPos = 17.5;  // 280px
          const minPos = -17.1875;  // -275px

          paddlepos1 = Math.min(Math.max(newPosition, minPos), maxPos);
          return paddlepos1;
        });

        requestAnimationFrame(updatePaddlePosition);
      }
    };

    if (!gameOver) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      requestAnimationFrame(updatePaddlePosition);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver]);

  React.useEffect(() => {
    const updateSecondPaddlePosition = () => {
      if (!gameOver) {
        setSecondPaddlePos(() => {
          let newPosition;
          let cpuspeed: number = 0.8; // 7px
          newPosition = secondPaddlePos;
          if (ballposx > 0)
            if (secondPaddlePos < ballposy) {
              if (ballposy - secondPaddlePos <= cpuspeed)
                newPosition = secondPaddlePos + (ballposy - secondPaddlePos);
              else
                newPosition = secondPaddlePos + cpuspeed;
            }
            else if (secondPaddlePos > ballposy) {
              if (secondPaddlePos - ballposy <= cpuspeed)
                newPosition = secondPaddlePos - (secondPaddlePos - ballposy);
              else
                newPosition = secondPaddlePos - cpuspeed;
            }
          const maxPos = 17.5;  // 280px
          const minPos = -17.1875;  // -275px
          paddlepos2 = Math.min(Math.max(newPosition, minPos), maxPos);
          return paddlepos2;

        });
        requestAnimationFrame(updateSecondPaddlePosition);
      }
    };
    requestAnimationFrame(updateSecondPaddlePosition);
  }, [gameOver, ballposy]);


  return (
    <div className='table'>
      <Paddle color="#E15253" pos={`${firstPaddlePos}rem`} />
      <Ball color='white' setLeftScore={setLeftScore} setRightScore={setRightScore} Ballspeed={Ballspeed} setBallspeed={setBallspeed} setGameOver={setGameOver} gameOver={gameOver} />
      <Paddle color="#5699AF" pos={`${secondPaddlePos}rem`} />
      <Score leftScore={leftscore / 2} rightScore={rightscore / 2} />
      <div className="lineC">
        <div className="line"></div>
      </div>
    </div>
  );
}
export default Table