import GradienBox from '../../../../tools/GradienBox'
import "../Main.scss"
import RankTable from './RankTable'
import trophet from '../../../../assets/img/trophet.svg'
import { motion } from 'framer-motion';

function BestPlayers() {


  return (
    <motion.div
			initial={{ y: '100vh' }}
			animate={{ y: 0 }}
			exit={{ y: '100vh' }}
			transition={{delay: 0.4, duration: 0.4}} 
      className='box-box-cont' style={{ marginTop: '-0.5rem' }}>
      <h1 className='title-h1'>Best players</h1>
      <div className='box-cont' style={{ marginTop: '1.5625rem' }}>
        <GradienBox vh={920} minh={'211.2px'} mywidth="1201px" myheight="273px" myborder="40px">
          <img src={trophet} alt="" className='trophet' />
          <div className='bp-cont'>
            <RankTable />
          </div>
        </GradienBox>
      </div>
    </motion.div>
  )
}

export default BestPlayers