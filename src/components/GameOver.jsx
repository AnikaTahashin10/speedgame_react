import PropTypes from 'prop-types'; 

function GameOver({closeHandler, name, score, level}) {
  return (
    <div className="overlay">
      <div className="gameover_box">
        <h2>GAME OVER</h2>
        <div className="game_data">
          <p>{name}</p>
          <p className="score">{score}</p>
          <p>{level}</p>
        </div>
        <p>
          YOU ARE A LOST CASE
        </p>
        <button onClick={closeHandler}>X</button>
        
      </div>
    </div>
  );
}

GameOver.propTypes = {
  closeHandler: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired, 
  score: PropTypes.number.isRequired,
  level: PropTypes.number.isRequired
};

export default GameOver;
