import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalculateIcon from '@mui/icons-material/Calculate';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
 
export const navData = [
    {
        id: 0,
        icon: <AccountCircleIcon/>,
        text: "Log In",
        link: "/"
    },
    {
        id: 1,
        icon: <CalculateIcon/>,
        text: "Calculator",
        link: "calculator"
    },
    {
        id: 2,
        icon: <HistoryIcon/>,
        text: "History",
        link: "history"
    },
    {
        id: 3,
        icon: <LogoutIcon/>,
        text: "Log Out",
        link: "logout"
    }
]