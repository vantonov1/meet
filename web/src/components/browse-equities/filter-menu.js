import React from "react";
import "./filter-menu.css"
import SearchIcon from "@material-ui/icons/Search";
import Fab from "@material-ui/core/Fab";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import SelectDistricts from "../select-districts/view";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {hideDistrictsSelector, showDistrictsSelector} from "../select-districts/slice";

export default function FilterMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const {selectDistricts} = useSelector(state => state.selectDistricts, shallowEqual);
    const dispatch = useDispatch();

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelectType = type => {
        handleClose();
        props.onTypeSelected(type)
    };

    const handleSelectDistricts = () => {
        handleClose();
        dispatch(showDistrictsSelector())
    };

   const handleSelectSubway = () => {
        handleClose();
    };

    return (
        <div className="filter-menu">
            <Fab color="primary"    >
                <SearchIcon onClick={handleClick}/>
            </Fab>
            <Menu
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
                <Divider/>
                <MenuItem onClick={() => handleSelectDistricts()}>Выбрать районы</MenuItem>
                <MenuItem onClick={() => handleSelectSubway()}>Выбрать станции метро</MenuItem>
            </Menu>
            {selectDistricts && <SelectDistricts city={props.filter.city}
                                                 onOk={(s) => {dispatch(hideDistrictsSelector()); props.onDistrictsSelected(s)}}
                                                 onCancel={() => dispatch(hideDistrictsSelector())}/>}
        </div>
    )
}