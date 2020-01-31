import React from "react";
import {ListItem, Menu, MenuItem, Slider} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import SearchIcon from "@material-ui/icons/Search";
import CheckIcon from "@material-ui/icons/Check";
import Fab from "@material-ui/core/Fab";
import Divider from "@material-ui/core/Divider";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {
    getPriceRange,
    hideDistrictsSelector,
    hideSubwaysSelector,
    showDistrictsSelector,
    showSubwaysSelector
} from "./slice";
import SelectDistricts from "../select-districts/view";
import SelectSubways from "../select-subways/view";
import {EQUITY_TYPES} from "../common/equity-types";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
    root: {
        position: 'fixed',
        right: theme.spacing(1),
        top: theme.spacing(7)
    },
    priceRange: {
        marginTop: theme.spacing(5),
        marginRight: theme.spacing(4),
        marginLeft: theme.spacing(4),
    }
}));

export default function FilterMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const {selectDistricts, selectSubways, minPrice, maxPrice} = useSelector(state => state.filter, shallowEqual);
    const dispatch = useDispatch();
    const classes = useStyles();


    const minPriceValue = props.filter.minPrice < minPrice ? minPrice : props.filter.minPrice > maxPrice ? maxPrice : props.filter.minPrice;
    const maxPriceValue = props.filter.maxPrice < minPrice ? maxPrice : props.filter.maxPrice > maxPrice ? maxPrice : props.filter.maxPrice;

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
        dispatch(getPriceRange(props.filter))
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
        <div className={classes.root}>
            <Fab color="primary">
                <SearchIcon onClick={handleClick}/>
            </Fab>
            {Boolean(anchorEl) &&
            <Menu anchorEl={anchorEl} keepMounted open={true} onClose={handleClose} transitionDuration={0}>
                {Object.entries(EQUITY_TYPES).map(k => entityType(k[0], k[1], props.filter.type))}
                <Divider/>
                <MenuItem key="filter-regions" onClick={() => handleSelectDistricts()}>Выбрать районы</MenuItem>
                <MenuItem key="filter-subways" onClick={() => handleSelectSubway()}>Выбрать станции метро</MenuItem>
                {maxPrice && <Divider/>}
                {maxPrice && <ListItem key="filter-price">
                    <div>Цена</div>
                    <Slider
                        min={minPrice}
                        max={maxPrice}
                        value={[minPriceValue, maxPriceValue]}
                        marks={calcMarks(minPrice, maxPrice)}
                        valueLabelDisplay="on"
                        ValueLabelComponent={ValueLabelComponent}
                        className={classes.priceRange}
                        onChange={(event, value) => dispatch(props.onPriceRangeSelected(value))}
                        onChangeCommitted={(event) => dispatch(props.onPriceRangeCommitted())}
                    />
                </ListItem>}
            </Menu>}
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

    function calcMarks(minPrice, maxPrice) {
        let marks = [];
        for (let i = minPrice / 100000; i < maxPrice / 100000; i++)
            marks.push({value: i * 100000});
        return marks
    }

    function ValueLabelComponent(props) {
        const {children, open, value} = props;

        return (
            <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
                {children}
            </Tooltip>
        );
    }

    function entityType(type, name, selected) {
        return <MenuItem key={type} onClick={() => handleSelectType(type)}>
            {name}
            {type === selected && <CheckIcon fontSize="small"/>}
        </MenuItem>
    }
}