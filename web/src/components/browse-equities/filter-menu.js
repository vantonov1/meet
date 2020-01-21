import React from "react";
import "./filter-menu.css"
import SearchIcon from "@material-ui/icons/Search";
import CheckIcon from "@material-ui/icons/Check";
import Fab from "@material-ui/core/Fab";
import Menu from "@material-ui/core/Menu";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {hideDistrictsSelector, showDistrictsSelector} from "../select-districts/slice";
import {hideSubwaysSelector, showSubwaysSelector} from "../select-subways/slice";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import SelectDistricts from "../select-districts/view";
import SelectSubways from "../select-subways/view";


const TYPES = {
    RENT_ROOM: "Аренда комнат",
    RENT_FLAT: "Аренда квартир",
    RENT_BUSINESS: "Аренда коммерческих помещений",
    SALE_ROOM: "Продажа комнат",
    SALE_FLAT: "Продажа квартир",
    SALE_BUSINESS: "Продажа коммерческих помещений"
};

export default function FilterMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const {selectDistricts} = useSelector(state => state.selectDistricts, shallowEqual);
    const {selectSubways} = useSelector(state => state.selectSubways, shallowEqual);
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
        dispatch(showSubwaysSelector())
    };

    return (
        <div className="filter-menu">
            <Fab color="primary">
                <SearchIcon onClick={handleClick}/>
            </Fab>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {Object.entries(TYPES).map(k => entityType(k[0], k[1], props.filter.type))}
                <Divider/>
                <MenuItem onClick={() => handleSelectDistricts()}>Выбрать районы</MenuItem>
                <MenuItem onClick={() => handleSelectSubway()}>Выбрать станции метро</MenuItem>
            </Menu>
            {selectDistricts && <SelectDistricts city={props.filter.city}
                                                 onOk={(s) => {
                                                     dispatch(hideDistrictsSelector());
                                                     props.onDistrictsSelected(s)
                                                 }}
                                                 onCancel={() => dispatch(hideDistrictsSelector())}/>}
            {selectSubways && <SelectSubways city={props.filter.city}
                                             onOk={(s) => {
                                                 dispatch(hideSubwaysSelector());
                                                 props.onSubwaysSelected(s)
                                             }}
                                             onCancel={() => dispatch(hideSubwaysSelector())}/>}
        </div>
    );

    function entityType(type, name, selected) {
        if (type === selected) {
            return <MenuItem key={type}  onClick={() => handleSelectType({type})}>
                <span>
                    {name}
                    <CheckIcon fontSize="small"/>
                </span>
            </MenuItem>
        } else {
            return <MenuItem key={type} onClick={() => handleSelectType(type)}>{name}</MenuItem>
        }
    }
}