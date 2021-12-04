import '../App.css';
import tascLogo from '../resources/tasc_modeler.svg';
import xpace from '../resources/xpace-powered-by.svg';


function Logos() {

  return (
    <ul className="brands">
      <div className="brands__item">
        <img src={tascLogo} alt="" />
      </div>
      <div className="brands__item">
        <img src={xpace} alt="" /></div>
    </ul>
  );
}

export default Logos;
