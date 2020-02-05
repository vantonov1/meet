import React from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import InfiniteScroll from 'react-infinite-scroll-component';
import AutoSizer from "react-virtualized-auto-sizer";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
    squareMeters: { verticalAlign: "super"},
    info: {whiteSpace: "nowrap", overflow: "hidden", textOverflow:"ellipsis"}
}));

export default function EquitiesList(props) {
    const [selectedItem, setSelectedItem] = React.useState(-1);
    return (
        <AutoSizer>
            {({height, width}) => (
                <InfiniteScroll style={{width: width}}
                                dataLength={props.equities.length}
                                next={props.onFetch}
                                hasMore={props.hasMore}
                                loader={<LinearProgress/>}
                                height={height}
                                endMessage={<p/>}
                >
                    {props.equities?.map((equity, index) => (
                        <Equity key={equity.id} selected={index === selectedItem}
                                {...equity}
                                onClick={() => {
                                    setSelectedItem(index);
                                    props.onClick(equity)
                                }}
                        />
                    ))}
                </InfiniteScroll>
            )}
        </AutoSizer>
    )
}

export function Equity(props) {
    const classes = useStyles();
    const subway = props.address.subway;
    const district = props.address.district;
    return <ListItem button divider selected={props.selected} onClick={props.onClick}>
        <ListItemText>
            <Box width={1}><b>{props.price}&#8381;</b>&nbsp;{props.address.street}&nbsp;{props.address.building}</Box>
            <Box width={1} className="MuiTypography-colorTextSecondary MuiTypography-body2">
                {subway && <span><span
                    style={{color: '#' + subway.color}}>&#9632;</span><span>&nbsp;{subway.name}&nbsp;</span></span>}
                {!subway && district && <span>{district.name}&nbsp;р-н</span>}
                <span>&nbsp;{props.square}м<span className={classes.squareMeters}>2</span>
                    {props.rooms && <span>&nbsp;{props.rooms}кк</span>}</span>
                <Box width="100%" className={classes.info}>{props.info}</Box>
            </Box>
        </ListItemText>
    </ListItem>
}

