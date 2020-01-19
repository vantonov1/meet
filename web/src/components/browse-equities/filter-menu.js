import React from "react";
import "./filter-menu.css"
import SearchIcon from "@material-ui/icons/Search";
import Fab from "@material-ui/core/Fab";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

export default function FilterMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelectType = type => {
        handleClose();
        props.onTypeSelected(type)
    }

    return (
        <div className="filter-menu">
            <Fab color="primary" aria-label="add">
                <SearchIcon onClick={handleClick}/>
            </Fab>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleSelectType('RENT_ROOM')}>Аренда комнат</MenuItem>
                <MenuItem onClick={() => handleSelectType('RENT_FLAT')}>Аренда квартир</MenuItem>
                <MenuItem onClick={() => handleSelectType('RENT_BUSINESS')}>Аренда коммерческих помещений</MenuItem>
                <MenuItem onClick={() => handleSelectType('SALE_ROOM')}>Продажа комнат</MenuItem>
                <MenuItem onClick={() => handleSelectType('SALE_FLAT')}>Продажа квартир</MenuItem>
                <MenuItem onClick={() => handleSelectType('SALE_BUSINESS')}>Продажа коммерческих помещений</MenuItem>
            </Menu>
        </div>
    )
}