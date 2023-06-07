import { navData } from "../lib/navData";
import styles from "./sidenav.module.css"
import { NavLink } from "react-router-dom";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import { useState } from 'react';

export default function Sidenav(props) {
	
const [open, setopen] = useState(true)	

const toggleOpen = () => {
    setopen(!open)
}
	
  return (
<div className={open?styles.sidenav:styles.sidenavClosed}>
    <button className={styles.menuBtn} onClick={toggleOpen}>
            {open? <KeyboardDoubleArrowLeftIcon />: <KeyboardDoubleArrowRightIcon />}
    </button>
    {navData.map(item =>{
        return <NavLink key={item.id} className={styles.sideitem} to={item.link}>
                  {item.icon?item.icon:props.credits}
                   <span className={open?styles.linkText:styles.linkTextClosed}>{item.text}</span>
               </NavLink>
     })}
</div>
  )
}